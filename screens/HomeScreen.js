import React, { Component } from 'react';
import { ScrollView, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatCardChannel from './components/FlatCardChannel';
import CustomList from './components/CustomList';
import axios from 'axios';
import Realm from '../realmdb';
import Icon from 'react-native-ionicons';
import FlatCard from './components/FlatCard';
import FirebaseModule from './FirebaseModule';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.fetch_event_data = this.fetch_event_data.bind(this);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
  }

  async componentDidMount() {
    await this.update_user_token();
    let flag = await AsyncStorage.getItem('subscribed');
    if(flag){
      await this.handleSubscription();
    }
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  state = {
    isRefreshing: false,
    event_list: null,
  }

  handleSubscription = async () =>{
    FirebaseModule.subscribeTag('ogil7190');
    FirebaseModule.subscribeTag('menime');
    await AsyncStorage.setItem({ subscribed : 'true'});
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      if( token === null) return;
      this.setState({ token });
      await this.update_event_list();
      await this.updateUserDetails();
    } catch(Exception) {
      console.log(Exception);
    }
  }

  updateUserDetails = async () =>{
    axios.post('https://mycampusdock.com/auth/fetch-user', {}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then(async (response) => {
      if(!response.data.error){
        const str = await AsyncStorage.getItem('data');
        let data = JSON.parse(str);
        data.data = response.data.data;
        await AsyncStorage.setItem('data', JSON.stringify(data));
      }
    });
  }

  fetch_event_data = (token, last_updated, callback) => {
    axios.post('https://mycampusdock.com/events/user/get-event-list', { last_updated }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      console.log(response);
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          el.date = new Date(el.date);
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrolled = '100';
          el.enrollees = JSON.stringify(el.enrollees);
          el.media = JSON.stringify(el.media);
          el.contact_details = JSON.stringify(el.contact_details);
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
        });
        callback(response.data.data);
      }
    })
      .catch( err => {
        callback([]);
        console.log(err);
      })
      .then( () => {
        this.setState({ isRefreshing: false });
      });
  }


  update_event_list = async () => {
    let { token } = this.state;
    this.setState({ isRefreshing: true });
    const process_realm_obj = this.process_realm_obj;
    Realm.getRealm((realm) => {
      let EventsOld = realm.objects('Events').sorted('timestamp');
      let timestamp;
      try {
        timestamp = EventsOld[EventsOld.length - 1].timestamp;
      } catch(e) {
        timestamp = 'NONE';
      }
      this.fetch_event_data(token, timestamp, (data) => {
        if(data.length === 0) return;
        realm.write(() => {
          let i;
          for(i=0;i<data.length;i++) {
            try {
              realm.create('Events', data[i], true);
            } catch(e) {
              console.log(e);
            }
          }
        }); 
      });

      let Events = realm.objects('Events').sorted('timestamp');
      process_realm_obj(Events, (result) => {
        this.setState({ event_list: result.reverse() });
      });  
    });
  }

  getChannelUpdatesData = () =>{
    const data = [
      { image : 'https://mycampusdock.com/channels/dock.webp', title : 'Dock Blog Launched', channel_id : 'ogil7190', name : 'OGIL7190', data : 'Something', url : 'Something'},
      { image : 'https://mycampusdock.com/channels/dock-manager.webp', title : 'Dock Payments Portal Launched', name : 'Menime', channel_id : 'menime', data : 'Something', url : 'Something'}
    ];
    return data;
  }

  render() {
    const event_list = this.state.event_list === null ? [] : this.state.event_list;
    StatusBar.setHidden(false);
    return(
      <View style={{ flex: 1,backgroundColor : '#fff'}}>
        <StatusBar
          backgroundColor="rgb(31, 31, 92)"
          translucent
          barStyle="light-content"/>
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : 75, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.6, shadowOffset : {width : 1, height : 1}, elevation : 6}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5,}}>
            <TouchableOpacity onPress = {()=>this.props.navigation.openDrawer()}>
              <Icon style={{ color : '#fff', fontSize:35, padding : 5}} name='menu'/> 
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity>
              <Icon style={{ color : '#fff', fontSize:35, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style = {{backgroundColor: 'transparent'}}
          refreshControl={
            <RefreshControl
              colors={['rgb(31, 31, 92)']}
              refreshing={this.state.isRefreshing}
              onRefresh={this.update_event_list.bind(this)}
            /> }>

          <CustomList 
            title = "Channel Updates" 
            showTitle = {true}
            showMark = {true}
            isHorizontal = {true}
            data = {this.getChannelUpdatesData()}
            onRender = {({item})=> <FlatCardChannel image = {item.image} title = {item.title} channel_id = {item.channel_id} data = {item.data} url = {item.url} onPress={()=>this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item.channel_id, item : item})} /> }/>
          
          {/* <CustomList
            title = "All about Today" 
            showTitle = {true}
            showMark = {true}
            data={event_list}
            isHorizontal = {true}
            onRender={(item) => <FlatCardHorizontal image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title}channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
          
          <CustomList
            title = "From Your Channels"
            data={event_list}
            showTitle = {true}
            showMark = {true}
            isHorizontal = {true}
            onRender={(item) => <FlatCardHorizontal image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title}channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/> */}

          <CustomList
            title = "Upcoming Events"
            data={event_list}
            showTitle = {true}
            showMark = {true}
            style={{margin : 10, marginLeft : 20, marginRight : 20}}
            isHorizontal = {false}
            onRender={({item}) => <FlatCard image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title} channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(HomeScreen);