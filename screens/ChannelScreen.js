import React, { Component } from 'react';
import { ScrollView, Text, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Realm from '../realmdb';
import Icon from 'react-native-ionicons';
import FirebaseModule from './FirebaseModule';
import ChannelCard from './components/ChannelCard';

class ChannelScreen extends Component {
  constructor(props) {
    super(props);
    this.fetch_event_data = this.fetch_event_data.bind(this);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount() {
    await this.update_user_token();
    let flag = await AsyncStorage.getItem('subscribed');
    if(flag){
      await this.handleSubscription();
    }
  }

  UNSAFE_componentWillMount(){
    console.log('Mounted');
  }

  componentWillUnmount(){
    console.log('Unmounted');
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
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
    } catch(Exception) {
      console.log(Exception);
    }
  }

  unsaveUser = async ()=>{
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  fetch_event_data = (token, last_updated, callback) => {
    axios.post('https://mycampusdock.com/events/user/get-event-list', { last_updated }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          el.date = new Date(el.date);
          el['enrolled'] = '100'; // 100 for not enrolled
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrollees = JSON.stringify(el.enrollees);
          el.media = JSON.stringify(el.media);
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
        console.log('Data', result);
        this.setState({ event_list: result.reverse() });
      });  
    });
  }

  render() {
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
            <TouchableOpacity onPress = {()=>console.log('Search works here!')}>
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
            />
          }>
          <Text style={{fontSize : 18, marginLeft :16, marginTop : 5, marginBottom:5}}>
            Popular Channels
          </Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={[{ name  : 'Gate Preparation', channel : 'ogil7190', college : 'Manav Rachna International University', image : 'https://i2.wp.com/www.oxbridgeacademy.edu.za/blog/wp-content/uploads/2017/12/study-1968077_1280.jpg?resize=1000%2C640&ssl=1'},
              { name  : 'Node Full Stack Club',channel : 'ogil7190', college : 'Manav Rachna International University', image : 'https://cdn.colorlib.com/wp/wp-content/uploads/sites/2/nodejs-frameworks.png'},
              { name  : 'Dance Society',channel : 'ogil7190', college : 'Manav Rachna International University', image : 'https://qph.fs.quoracdn.net/main-qimg-e2967a14f10ca1128625017c6bc599b2-c'}]}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <ChannelCard data={item} onPress={()=>this.props.navigation.navigate('ChannelDetailScreen', {item})} />}/>

          <Text style={{fontSize : 18, marginLeft :16, marginTop : 5, marginBottom:5}}>
            Technology Channels
          </Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={[{ name  : 'React Developers Club', channel : 'menime', college : 'Manav Rachna International University', image : 'https://wpcouple.com/wp-content/uploads/2017/10/Interview-React-2.jpg'},
              { name  : 'Android Secrets',channel : 'menime', college : 'Manav Rachna International University', image : 'https://images4.alphacoders.com/128/128256.jpg'},
              { name  : 'True Web Development',channel : 'menime', college : 'Manav Rachna International University', image : 'https://pre00.deviantart.net/f2a1/th/pre/i/2014/084/d/8/web_developer_wallpaper__code__by_plusjack-d7bmt54.jpg'}]}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <ChannelCard data={item} onPress={()=>this.props.navigation.navigate('ChannelDetailScreen', {item})} />}/>


          <Text style={{fontSize : 18, marginLeft :16, marginTop : 5, marginBottom:5}}>
            {'Art & Craft'}
          </Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={[{ name  : 'Third Eye', channel : 'ogil7190', college : 'Manav Rachna International University', image : 'https://liveanddare.com/wp-content/uploads/2015/09/what-is-spirituality.jpg'},
              { name  : 'Inner Engineering',channel : 'ogil7190', college : 'Manav Rachna International University', image : 'https://www.marj3.com/wp-content/uploads/2018/08/cropped-biologyImage.jpg'}]}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <ChannelCard data={item} onPress={()=>this.props.navigation.navigate('ChannelDetailScreen', {item})} />}/>
        </ScrollView>
      </View>
    );
  }
}

ChannelScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(ChannelScreen);