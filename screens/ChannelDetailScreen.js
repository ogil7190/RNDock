import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity, Alert, Platform, ActivityIndicator, ScrollView, FlatList, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import Realm from '../realmdb';
import Story from './components/Story';
import Swiper from 'react-native-swiper';
import FlatCardList from './components/FlatCardList';

class ChannelDetailScreen extends Component {
  state = {
    isRefreshing : false,
    sorted_activities : null,
    token : null,
    tab : 0,
    channel : null,
  }

  static navigationOptions = {
    header: null,
  };

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

  fetch_data = (channel_id) => {
    axios.post('https://mycampusdock.com/channels/user/fetch-channel', { channel_id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then(response => { 
      if(!response.data.error){
        response.data.data.media = JSON.stringify(response.data.data.media);
        response.data.data.followers = ''+response.data.data.followers;
        response.data.data.followed = ''+response.data.data.followed;
        response.data.data.priority = '' + response.data.data.priority;

        let channel = response.data.data;
        console.log('Fetched Channel : ', channel);

        Realm.getRealm((realm) => {
          realm.write(() => {
            realm.create('Channel', channel, true);
          });

          if(JSON.parse(channel.followed)){
            let OldRecords = realm.objects('Activity').filtered('channel = "'+channel_id +'"').sorted('timestamp', true);
            let last_updated;
            try {
              last_updated = OldRecords[0].timestamp;
            } catch(e) {
              last_updated = 'NONE';
            }
            this.fetch_activity(last_updated, channel_id, (activities)=>{
              realm.write(() => {
                let i;
                for(i=0;i<activities.length;i++) {
                  try {
                    realm.create('Activity', activities[i], true);
                  } catch(e) {
                    console.log(e);
                  }
                }
              });
              this.setChannel(channel_id, (exists)=>{
                console.log(exists);
              });
            });
          }
          if(this.state.isRefreshing){
            this.setState({ isRefreshing: false });
            this.setChannel(channel_id, (exists)=>{
              console.log(exists);
            });
          }
        });
      }
    }).catch(err =>{
      this.setState({ isRefreshing: false });
      console.log(err);
    });
  }

  fetch_activity = (last_updated, channel_id, callback) =>{
    axios.post('https://mycampusdock.com/channels/get-activity-list', { last_updated, channel_id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      console.log(response.data);
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.options = el.type === 'poll' ? JSON.stringify(el.options) : 'NONE';
          el.media = el.type === 'post-image' ? el.media[0] : 'NONE';
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          el.poll_type = el.poll_type === undefined ? 'NONE' : el.poll_type;
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
          el.answered = el.answered === undefined ? '' + false : JSON.stringify(el.answered);
        });
        callback(response.data.data);
      }
    }).catch(err => {
      console.log(err);
    });
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

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  async UNSAFE_componentWillMount(){
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    if( token === null) return;
    if(this.state.token == null)
      this.setState({token});
    
    const { navigation } = this.props;
    const channel_id = navigation.getParam('channel_id', {});
    this.setChannel(channel_id, (exists)=>{
      if(!exists){
        this.setState({isRefreshing : true});
      }
      this.fetch_data(channel_id);
    });
  }

  setChannel = (channel_id, callback) =>{
    Realm.getRealm((realm) => {
      let channels = realm.objects('Channel').filtered('_id = "' + channel_id + '"');
      this.process_realm_obj(channels, (channels) => {
        console.log('Got Channel', channels);
        if(channels.length > 0){
          let Activity = realm.objects('Activity').filtered('channel = "'+channel_id +'"').sorted('timestamp', true);
          this.process_realm_obj(Activity, (activities) => {
            let sorted_activities = this.handleResponse(activities);
            this.fetch_events(channel_id, (events)=>{
              this.setState({channel : channels[0], sorted_activities, events}, ()=>callback(true));
            });
          });
        } else{
          callback(false);
        }
      });
    });
  }

  handlePress = (item, data, index) =>{
    if(data){
      if(this.state.activities[index].type === 'poll'){
        this.markPoll(item, data.key, index);
      }
    }
  }

  unfollow = () =>{
    this.setState({isRefreshing : true});
    axios.post('https://mycampusdock.com/channels/user/unfollow', {channel_id : this.state.channel._id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.error)
        this.fetch_data(this.state.channel._id);
    }).catch(e =>{
      console.log('error', e);
    });
  }

  follow = () =>{
    this.setState({isRefreshing : true});
    axios.post('https://mycampusdock.com/channels/user/follow', {channel_id : this.state.channel._id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.error)
        this.fetch_data(this.state.channel._id);
    }).catch(e =>{
      console.log('error', e);
    });
  }

  handleFollowPress = () =>{
    if( this.state.channel)
      if(!JSON.parse(this.state.channel.followed)){
        this.follow();
      } else {
        this.handleUnfollow();
      }
  }

  handleUnfollow = () =>{
    Alert.alert(
      'Do you want to unfollow this channel ?',
      'You will no longer see activities from this channel again.',
      [
        {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        {text: 'Unfollow', onPress: () => this.unfollow()},
      ],
      { cancelable: true }
    );
  }

  markPoll = (item, key, index) =>{
    axios.post('https://mycampusdock.com/channels/make-poll', { _id : item._id, option : key}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      console.log(response, index);
    });
  }

  fetch_events = (channel_id, callback) =>{
    Realm.getRealm((realm) => {
      let events = realm.objects('Events').filtered('channel = "'+channel_id +'"').sorted('timestamp', true);
      this.process_realm_obj(events, (result) =>{
        callback(result);
      });
    });
  }

  getMini = () =>{
    return(
      <View style={{flex : 1}}>
        <View style={{backgroundColor : '#fff', flexDirection : 'row', borderWidth : 0.5, borderColor : '#cfcfcf'}}>
          <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2}} onPress={()=>this.setState({tab : 0})}>
            <Icon name = 'pulse' style={{margin : 4, color : this.state.tab === 0 ? 'rgb(31, 31, 92)' : '#cfcfcf'}}/>
          </TouchableOpacity>

          <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,}} onPress={()=>this.setState({tab : 1})}>
            <Icon name = 'albums' style={{margin : 4, color : this.state.tab === 1 ? 'rgb(31, 31, 92)' : '#cfcfcf'}}/>
          </TouchableOpacity>
        </View>
        <Swiper
          loop={false}
          scrollEnabled ={false}
          index={this.state.tab}
          showsPagination={false}>
          <ScrollView style={{flex : 1}}>
            {
              Object.entries(this.state.sorted_activities).map((data, index) =>
                <View  key= {index} style={{backgroundColor : 'rgb(250, 250, 250)'}}>
                  <View style={{flexDirection : 'row', margin : 10}}>
                    <View style={{backgroundColor : '#efefef', shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3, borderRadius : 20, paddingRight : 10, paddingLeft : 10}} >
                      <Text style={{fontSize : 15, padding : 5, paddingRight : 10, paddingLeft : 10}}>{data[0]}</Text>
                    </View>
                    <View style={{flex : 1}}/>
                    <TouchableOpacity style={{width : 35, backgroundColor : '#efefef', shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3, borderRadius : 20, justifyContent : 'center'}} onPress={()=>this.props.navigation.navigate('StoryPreview', {item : data[1]})}>
                      <Text style={{fontSize : 15, textAlign : 'center', paddingLeft : 3}}><Icon name='play' style={{fontSize : 30}} /></Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    style={{backgroundColor : 'rgb(250, 250, 250)', paddingTop : 10}}
                    keyExtractor={(item, index) => index.toString()}
                    data={data[1]}
                    numColumns = {3}
                    renderItem={(item)=> <Story data = {item} onPress={()=>this.props.navigation.navigate('StoryPreview', {item : [item]})}/>} /> 
                </View>
              )
            }
          </ScrollView>
          <FlatList
            style={{backgroundColor : 'rgb(250, 250, 250)', paddingLeft : 20, paddingRight : 20, paddingTop : 10}}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.events}
            renderItem={({item}) => <FlatCardList image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title}channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
        </Swiper>
      </View>);
  }

  getContent = () =>{
    if(this.state.isRefreshing){
      return (<ActivityIndicator style={{margin : 5}} size="small" color="rgb(31, 31, 92)" animating={this.state.isRefreshing}/>);
    }
    if(this.state.channel && JSON.parse(this.state.channel.followed)){
      return(this.getMini());
    } else {
      return (
        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
          <View style={{width : 100, height : 100, borderWidth : 3, borderRadius : 50, borderColor : '#c5c5c5', padding : 10}}>
            <Icon name = 'lock' style={{fontSize : 64, textAlign : 'center', color : '#a5a5a5'}}/>
          </View>
          <Text style={{fontSize : 15, color : '#c5c5c5', textAlign : 'center', margin : 10}}>Follow the channel to see their content.</Text>
        </View>
      );
    }
  }

  showUsers = () =>{
    if(!this.state.isRefreshing && this.state.channel.followers >0){
      this.props.navigation.navigate('ChannelUsersScreen', {channel : this.state.channel});
    }
  }
  
  render() {
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>
        <View style = {{ backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, justifyContent : 'center', alignItems : 'center'}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <TouchableOpacity onPress = {()=>goBack()} style= {{padding : 5, marginLeft : 10}}>
              <Icon name="arrow-back" style={{ color: 'red', fontSize: 30, textAlign : 'center'}}/>
            </TouchableOpacity>
            <Text style={{fontSize :20, textAlign : 'center', flex : 1, textAlignVertical : 'center', paddingRight : 20,  alignContent : 'center'}}>{this.state.channel ? this.state.channel.name : 'Channel'}</Text>
          </View>
        </View>
        <View style={{padding : 20, backgroundColor : '#fff',}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <FastImage
              style={{height: 72, width: 72, borderRadius : 40, borderWidth : 1, borderColor : '#c5c5c5'}}
              source={{
                uri : this.state.channel ? 'https://mycampusdock.com/' + JSON.parse(this.state.channel.media)[0] : 'NONE' ,
                priority : FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize : 18, textAlign : 'left', textAlignVertical : 'center', marginLeft : 10}}>{this.state.channel ? this.state.channel.name : 'Loading'}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <Text style={{textAlign : 'center'}}>{this.state.channel ? this.state.channel.description : 'Loading...'}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}} onPress={()=>this.showUsers()}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{this.state.isRefreshing ? 'Loading' : this.state.channel ? this.state.channel.followers === undefined ? 0 : this.state.channel.followers : '...'}</Text>
              <Icon name = 'people' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5, justifyContent : 'center'}} onPress = {this.handleFollowPress}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{ this.state.isRefreshing ? 'Loading' : this.state.channel ? JSON.parse(this.state.channel.followed) ? 'Following' : 'Follow' : 'Loading'}</Text>
              <Icon name = {this.state.channel ? JSON.parse(this.state.channel.followed) ? 'checkmark' : 'lock'  : 'lock'} style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}}>
              <Text style={{fontSize : 15, textAlign : 'center',  margin : 4}}>{this.state.isRefreshing ? 'Loading' : 'Settings'}</Text>
              <Icon name = 'settings' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}}>
              <Icon name = 'more' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>
          </View>
        </View>
        {this.getContent()} 
      </View>
    );
  }
}

ChannelDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default ChannelDetailScreen;