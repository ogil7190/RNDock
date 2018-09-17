import React, { Component } from 'react';
import { AsyncStorage, Animated, StatusBar, FlatList, Text, View,TouchableOpacity,  RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import UserAvatar from 'react-native-user-avatar';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Realm from '../realmdb';
import Modal from 'react-native-modal';
import Icon from 'react-native-ionicons';

const HEADER_MAX_HEIGHT = 100;

class PreviewChannel extends Component {
  constructor(props) {
    super(props);
    this.fetch_activity_data = this.fetch_activity_data.bind(this);
    this.update_activity_list = this.update_activity_list.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.handle_poll_button = this.handle_poll_button.bind(this);
    this.update_poll_helper = this.update_poll_helper.bind(this);
  }

  componentDidMount() {
    this.update_user_token();
    const process_realm_obj = this.process_realm_obj;
    Realm.getRealm((realm) => {
      let Activity = realm.objects('Activity').sorted('timestamp');
      process_realm_obj(Activity, (result) => {
        this.setState({ activityList: result.reverse() });
      });
    });
    this.hanldeChannel();
  }

  hanldeChannel = () =>{
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
    if(this.state.channelId == null){
      this.setState({ channelId : item.channel, channelName : item.name});
      this.update_activity_list();
    }
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      if( token === null) return;
      var decoded = jwt_decode(token);
      console.log(decoded);
      //this.setState({ token, name: decoded.name, channelName: decoded.channel.name, channelId: decoded.channel.id });
    } catch(Exception) {
      console.log(Exception);
    }
  }
  state = {
    scrollY: new Animated.Value(0),
    channelName: 'Please Wait',
    channelId: null,
    activityList: null,
    isRefreshing: false,
    activity: null,
    name: '',
    modal: false,
    token: '',
    modal_content: [],
    modal_loading: true
  }
  static navigationOptions = {
    header: null
  }

  fetch_activity_data = (token, last_updated, callback) => {
    axios.post('https://mycampusdock.com/channels/get-activity', { last_updated, channel : this.state.channelId }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.options = el.type === 'poll' ? JSON.stringify(el.options) : 'NONE';
          el.media = el.type === 'post-image' ? el.media[0] : 'NONE';
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
          el.answered = 'false';
        });
        console.log(response.data.data);
        callback(response.data.data);
      }
      console.log(response);
    } )
      .catch( err => {
        callback([]);
        console.log(err);
      })
      .then( () => {
        this.setState({ isRefreshing: false });
      });
  }

  

  update_poll_helper = (_id) => {
    Realm.getRealm((realm) => { 
      realm.write(() => {
        console.log('updating '+_id);
        realm.create('Activity', { _id, answered: 'true' }, true);
      });
    });
  }

  handle_poll_button = (_id, option) => {
    let { token } = this.state;
    console.log(_id, option);

    let update_poll_helper = this.update_poll_helper;

    this.setState({ modal: true, modal_loading: true, modal_content: [] });
    axios.post('https://mycampusdock.com/channels/make-poll', { _id, option }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      console.log(response);
      if(!response.data.error) {
        update_poll_helper(_id);
        const old = this.state.activityList;
        const index = old.findIndex(x => x._id === _id);
        old[index].answered = 'true';
        this.setState({ modal_loading: false, modal_content: [{ option: 'dope', percentage: '75%' }], activityList: old });
      } else {
        this.setState({ modal_loading: false });
      }
    }).catch( err => {
      console.log(err);
      this.setState({ modal: false });
    }).then( () => {
      this.setState({ modal_loading: false });
    });
  }

  update_activity_list = async () => {
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    const process_realm_obj = this.process_realm_obj;
    this.setState({ isRefreshing: true });
    Realm.getRealm((realm) => { 
      let OldRecords = realm.objects('Activity').sorted('timestamp');
      let timestamp;
      try {
        timestamp = OldRecords[OldRecords.length - 1].timestamp;
      } catch(e) {
        timestamp = 'NONE';
      }
      this.fetch_activity_data(token, timestamp, (data) => {
        if(data.length === 0) return;
        realm.write(() => {
          let i;
          for(i=0;i<data.length;i++) {
            try {
              realm.create('Activity', data[i]);
            } catch(e) {
              console.log(e);
            }
          }
        });
        let Activity = realm.objects('Activity').sorted('timestamp');
        process_realm_obj(Activity, (result) => {
          this.setState({ activityList: result.reverse() });
        });
      });
    });
  }
  render() {
    const activity = this.state.activityList === null ? [] : this.state.activityList;
    
    // const modalData = [{ 'option': 'dope', value: 0.9 }, { 'option': 'not dope', value: 0.1 }];
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
    const {goBack} = this.props.navigation;

    const animatedHeaderText = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [5, 20],
      extrapolate: 'clamp'
    });
    
    const animatedHeaderIcon = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [15, 30],
      extrapolate: 'clamp'
    });

    const imageOffset = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [0.1, 0],
      extrapolate: 'clamp'
    });

    StatusBar.setBarStyle('light-content', true);
    return(
      <View style={{flex : 1}}>
        <Modal isVisible={this.state.modal}>
          <View>
            <View style={{ flex: 1, height: 5, backgroundColor: 'red' }}></View>
            <View style={{ flex: 1 , height: 5, backgroundColor: 'green' }}></View>
          </View>
          <View style={{ 
            // justifyContent: 'center', 
            // alignItems: 'center',
            backgroundColor: '#fff',
            height: 250,
            borderRadius: 6,
            // flexDirection: 'column'
          }}
          >
            
            <View>
              <Text style={{ textAlign: 'center' }}>Thank you for participating :), this section is still under development</Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({ modal: false })} style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
              margin: 5
            }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Animated.View style={{ 
          opacity: 1,
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: HEADER_MAX_HEIGHT,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          overflow: 'hidden'
        }}>
          <View
            style={{
              backgroundColor: '#222831',
              height: '100%',
              width: '100%'
            }}
          >
            <Animated.View
              style={{
                opacity: imageOffset
              }}
            >
              <FastImage
                style={{ 
                  width: '100%', 
                  height: '100%',
                }} 
                source={{
                  uri: 'https://images.careers360.mobi/sites/default/files/content_pic/mriu.jpg'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Animated.View>
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              alignContent: 'center',
              bottom: animatedHeaderText,
              alignSelf: 'center'
            }}
          >
            <Text style={{  color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 15,  bottom: 0 }}>{this.state.channelName}</Text>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              // alignContent: 'center',
              bottom: animatedHeaderIcon,
              right: 15,
              // zIndex: 1,
              // alignSelf: 'center'
            }}
          >
            <Icon name='people' style={{ color: 'white' }} onPress={() => this.props.navigation.navigate('UsersScreen')} />
          </Animated.View>
          
        </Animated.View>
        
        

        <View
          style={{
            marginTop: HEADER_MAX_HEIGHT,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
          refreshControl={
            <RefreshControl  refreshing={this.state.isRefreshing}
              onRefresh={this.update_activity_list.bind(this)}
            />
          }
        >
          {/* <Button onPress={() => this.setState({ modal: true })}>
            <Text>show modal</Text>
          </Button> */}
          <FlatList
            scrollEventThrottle={16}
            keyExtractor={(item) => item._id}
            style={{ 
              marginLeft: 2,
              marginRight: 2,
              marginTop: 5
            }} 
            data={activity}
            renderItem={({ item }) => { 
              // console.log(item.type);
              if(item.type === 'post') 
                return <View key={item._id}>
                  <View style={{ paddingBottom: 20 }}>  
                    <View>
                      <UserAvatar style={{ marginRight: 5 }} size="50" name={item.name} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        flex: 1
                      }}>
                        {item.message}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        opacity: 0.4
                      }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 10,
                      position: 'absolute',
                      bottom: 2,
                      right: 4
                    }}>
                      {new Date(item.timestamp).getDate()}/{new Date(item.timestamp).getMonth() + 1}/{new Date(item.timestamp).getFullYear()} {new Date(item.timestamp).getUTCHours()}:{new Date(item.timestamp).getMinutes()} 
                    </Text>
                  </View>
                </View>;
              else if(item.type === 'poll') {
                let options = JSON.parse(item.options);
                let optionsP = [];
                let total = 0;
                Object.keys(options).forEach((key) => { optionsP.push(key); total += options[key].length; });
                return <View key={item._id} style={{ padding: 2 }}>  
                  <View style={{ paddingBottom: 20, marginBottom: 5 }}>  
                      
                    <View>
                      <UserAvatar style={{ marginRight: 5 }} size="50" name={item.name} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        flex: 1
                      }}>
                        {item.message}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        opacity: 0.4
                      }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 10,
                      position: 'absolute',
                      bottom: 2,
                      right: 4
                    }}>
                    
                      {new Date(item.timestamp).getDate()}/{new Date(item.timestamp).getMonth() + 1}/{new Date(item.timestamp).getFullYear()} {new Date(item.timestamp).getUTCHours()}:{new Date(item.timestamp).getMinutes()} 
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, marginBottom: 2, marginLeft: 3, marginRight: 3, borderRadius: 2, overflow: 'hidden' }}>
                    {/* <View style={{ flex: 1 , height: 2, backgroundColor: '#00adb5' }}></View> */}
                    <View style={{ flex: 1, height: 2, backgroundColor: item.answered === 'false' ? '#db3951' : '#a1c45a' }}></View>
                  </View>
                  {item.answered === 'false' && optionsP.map((key, index) => <View key={index}>
                    <TouchableOpacity light bordered style={{ flex: 1, margin: 2 }} onPress={() => this.handle_poll_button(item._id, key)}>
                      <Text style={{ flex: 1, fontWeight: '100', fontSize: 13, color: 'gray' }}>
                        {key.toUpperCase()}
                      </Text>
                      <Icon name='heart' style={{ color: '#'+Math.floor(100000 + Math.random() * 900000), opacity: 0.4 }}/>
                    </TouchableOpacity>
                  </View> )}
                  
                </View>;
              }
              else if(item.type === 'post-image') {
                return <View key={item._id} style={{ padding: 2 }}>  
                  <View style={{ paddingBottom: 20, marginBottom: 5 }}>  
                    <View>
                      <UserAvatar style={{ marginRight: 5 }} size="50" name={item.name} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        flex: 1
                      }}>
                        {item.message}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        opacity: 0.4
                      }}>
                        {item.name}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 10,
                      position: 'absolute',
                      bottom: 2,
                      right: 4
                    }}>
                    
                      {new Date(item.timestamp).getDate()}/{new Date(item.timestamp).getMonth() + 1}/{new Date(item.timestamp).getFullYear()} {new Date(item.timestamp).getUTCHours()}:{new Date(item.timestamp).getMinutes()} 
                    </Text>
                  </View>
                  <View style={{ marginTop: 5, marginBottom: 2, marginLeft: 3, marginRight: 3, borderRadius: 2, overflow: 'hidden' }}>
                    {/* <View style={{ flex: 1 , height: 2, backgroundColor: '#00adb5' }}></View> */}
                    <View style={{ flex: 1, height: 2, backgroundColor: '#db3951' }}></View>
                  </View>
                  <View style={{ flex: 1, margin: 5 }}>
                    <FastImage
                      style={{ width: '100%', height: 200, borderRadius: 6 }}
                      source={{
                        uri: 'https://mycampusdock.com/' + item.media,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                </View>;
              }
            }}
          />
          <View style={{ height: 150 }}></View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return { general: state.general };
};

PreviewChannel.propTypes = {
  navigation: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PreviewChannel);