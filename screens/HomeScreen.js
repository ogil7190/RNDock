import React, { Component } from 'react';
import { ScrollView, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatCardChannel from './components/FlatCardChannel';
import CustomList from './components/CustomList';
import axios from 'axios';
import Realm from '../realmdb';
import Icon from 'react-native-ionicons';
import FlatCard from './components/FlatCard';
import FlatCardHorizontal from './components/FlatCardHorizontal';
import FirebaseModule from './FirebaseModule';
import Modal from 'react-native-modalbox';
import PreviewStory from './components/PreviewStory';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.fetch_event_data = this.fetch_event_data.bind(this);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
    this.modal = null;
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
    week_events : [],
    channels : [],
    sorted_activities : {}
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
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          let ts = Date.parse(''+el.date);
          el.date = new Date(el.date);
          el.ms = ts;
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrolled = JSON.stringify(el.enrolled);
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

  getChannelList = (callback) =>{
    Realm.getRealm((realm) => {
      let channels = realm.objects('Channel').filtered('followed = "true"');
      this.process_realm_obj(channels, (result)=>{
        let channel_list = {};
        for(var i=0; i<result.length; i++){
          let OldRecords = realm.objects('Activity').filtered('channel = "'+result[i]._id +'"').sorted('timestamp', true);
          let last_updated;
          try {
            last_updated = OldRecords[0].timestamp;
          } catch(e) {
            last_updated = 'NONE';
          }
          channel_list[result[i]._id] = last_updated;
          if(i === result.length - 1) callback(channel_list);
        }
      });
    });
  }

  listChannelUpdates = () =>{
    this.getChannelList((list)=>{
      this.fetch_stories(list, ()=>{
        this.getChannelList((newlist)=>{
          var sortable = [];
          for (var entity in newlist) {
            if(newlist[entity] === 'NONE'){
              continue;
            }
            sortable.push([entity, newlist[entity]]);
          }
          sortable.sort(function(a,b){
            return a[1] - b[1];
          });
          let data = [];
          for(var i=0; i<sortable.length; i++){
            let channel_id = sortable[i][0];
            this.getChannel(channel_id, i, (elem, index)=>{
              if(elem) data.push(elem);
              if(index === sortable.length -1 ) this.setState({channels : data});
            });
          }
        });
      });
    });
  }

  getChannel = (channel_id, index, callback) =>{
    Realm.getRealm((realm) => {
      let channels = realm.objects('Channel').filtered('_id = "' + channel_id + '"');
      this.process_realm_obj(channels, (data)=>{
        if(data.length>0) callback(data[0], index);
        else callback(null);
      });
    });
  }

  fetch_stories = (channel_list, callback) =>{
    let list = JSON.stringify(channel_list);
    axios.post('https://mycampusdock.com/channels/fetch-activity-list', { channels_list :  list}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.data.error) {
        let data = response.data.data;
        let keys = Object.keys(response.data.data);
        for(var i=0; i<keys.length; i++){
          let resp = data[keys[i]].data;
          resp.forEach((el)=>{
            el.options = el.type === 'poll' ? JSON.stringify(el.options) : 'NONE';
            el.media = el.type === 'post-image' ? el.media[0] : 'NONE';
            el.audience = JSON.stringify(el.audience);
            el.timestamp = new Date(el.timestamp);
            el.poll_type = el.poll_type === undefined ? 'NONE' : el.poll_type;
            el.reach = JSON.stringify(el.reach);
            el.views = JSON.stringify(el.views);
            el.answered = el.answered === undefined ? '' + false : JSON.stringify(el.answered);
          });
          Realm.getRealm((realm) => {
            realm.write(() => {
              let i;
              for(i=0;i<resp.length;i++) {
                try {
                  realm.create('Activity', resp[i], true);
                } catch(e) {
                  console.log(e);
                }
              }
            });
          });

          if(i===keys.length-1){
            callback();
          }
        }
      }
    }).catch(err => {
      console.log(err);
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
      let ts = Date.parse(new Date()) + (7 * 24 * 60 * 60 * 1000);
      let cs = Date.parse(new Date());
      let Events = realm.objects('Events').filtered('enrolled = "false"').filtered('ms > ' + cs).sorted('date');
      let week_events = realm.objects('Events').filtered('ms < ' + ts + ' AND ms > ' + cs).sorted('date');
      
      process_realm_obj(week_events, (result) => {
        this.setState({ week_events : result});
      });  

      process_realm_obj(Events, (result) => {
        this.setState({ event_list : result});
      });
      
      this.listChannelUpdates();
    });
  }

  unsave = async () =>{
    Realm.getRealm((realm)=>{
      realm.write(async () => {
        realm.deleteAll();
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login', {});
      });
    });
  }

  parseDate = (timestamp) =>{
    var monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const curent = new Date(timestamp);
    var date = curent.getDate();
    var month = curent.getMonth();
    var year = curent.getFullYear();
    return date + '-' +monthNames[month] + '-' + year;
  }

  handleResponse = (data) =>{
    let sorted_activities = {};
    let t = null;
    for(var index = 0; index < data.length; index ++){
      let item = data[index];
      let current = this.parseDate(item.timestamp);
      if(current !== t){
        t = current;
        sorted_activities[t] = [];
      }
      sorted_activities[t].push(item);
    }
    return sorted_activities;
  }

  showUpdates = (channel_id) =>{
    Realm.getRealm((realm)=>{
      let Activity = realm.objects('Activity').filtered('channel = "'+channel_id +'"').sorted('timestamp', true);
      this.process_realm_obj(Activity, (activities) => {
        let sorted_activities = this.handleResponse(activities);
        let keys = Object.keys(sorted_activities);
        
        if(keys.length > 0){
          this.setState({sorted_activities}, ()=>{
            this.modal.open();
          });
        }
      });
    });
  }

  render() {
    const event_list = this.state.event_list === null ? [] : this.state.event_list;
    let keys = Object.keys(this.state.sorted_activities);
    StatusBar.setHidden(false);
    return(
      <View style={{ flex: 1,backgroundColor : '#fff'}}>
        <StatusBar
          backgroundColor="rgb(31, 31, 92)"
          translucent
          barStyle="light-content"/>
          
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : 80, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.6, shadowOffset : {width : 1, height : 1}, elevation : 6, paddingBottom : 5}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5,}}>
            <TouchableOpacity style = {{backgroundColor : '#fff', borderRadius : 30, width : 35, height : 35,justifyContent : 'center', alignItems : 'center', marginLeft : 5}}>
              <Icon style={{ color : 'rgb(31, 31, 92)', fontSize:25, padding:5}} name='notifications'/>
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity style = {{backgroundColor : '#fff', borderRadius : 30, width : 35, height : 35,justifyContent : 'center', alignItems : 'center', marginRight : 5}} onPress={()=>this.props.navigation.navigate('SearchScreen', {data : {type : 'home', placeholder : 'Search events with the name, type, content, creator etc.'}})}>
              <Icon style={{ color : 'rgb(31, 31, 92)', fontSize:25, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style = {{backgroundColor: 'transparent',}}
          refreshControl={
            <RefreshControl
              colors={['rgb(31, 31, 92)']}
              refreshing={this.state.isRefreshing}
              onRefresh={this.update_event_list.bind(this)}
            /> }>

          <CustomList 
            title = "Channels Updates" 
            showTitle = {true}
            automaticTitle = {true}
            isHorizontal = {true}
            data = {this.state.channels}
            onRender = {({item})=> <FlatCardChannel data = {item} onPress={()=>this.showUpdates(item._id)} /> }/>
          
          <CustomList
            title = "Events this Week"
            data={this.state.week_events}
            automaticTitle = {true}
            showTitle = {true}
            isHorizontal = {true}
            onRender={({item}) => <FlatCardHorizontal image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title} channel = {item.channel_name} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>

          <CustomList
            title = "Upcoming Events"
            data={event_list}
            automaticTitle = {true}
            showTitle = {true}
            isHorizontal = {false}
            onRender={({item}) => <FlatCard image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title} channel = {item.channel_name} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
        </ScrollView>

        <Modal swipeArea={500} ref={element => this.modal = element} coverScreen = {true} backdropPressToClose = {false} swipeThreshold = {80} isVisible = {false}>
          <PreviewStory item = {this.state.sorted_activities[keys[0]]} updates_only = {true} open = {false} onClose = {()=>this.modal.close()}/>
        </Modal>
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