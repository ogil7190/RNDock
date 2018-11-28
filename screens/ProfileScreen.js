import React, { Component } from 'react';
import {Platform, View, Image, RefreshControl, StatusBar, ScrollView, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';
import Realm from '../realmdb';
import axios from 'axios';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user  : null,
      loaded : false,
      isRefreshing : false
    };
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount(){
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    this.getEventsList((result)=>{
      this.setState({user : data.data, loaded : true, token : data.token, events : result}, ()=>{
        this.update_profile();
      });
    });
  }

  unsaveUser = ()=>{
    Realm.getRealm((realm)=>{
      realm.write(async () => {
        realm.deleteAll();
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login', {});
      });
    });
  }

  update_profile = async () =>{
    this.setState({isRefreshing : true});
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
        this.getEventsList((events)=>{
          this.getChannelsList((channels)=>{
            this.setState({isRefreshing : false, user : data.data, events, channels});
          });
        });
      }
    }).catch((e)=>{
      console.log(e);
      this.setState({isRefreshing : false});
    }).then(()=>{
      this.setUsers();
    });
  }

  getEventsList = (callback) =>{
    Realm.getRealm((realm) => {
      let events = realm.objects('Events').filtered('enrolled = "true"').sorted('timestamp');
      this.process_realm_obj(events, (result)=>{
        callback(result);
      });
    });
  }

  setUsers = () =>{
    let data = this.state.user.connections;
    let length = data.length;
    let users = [];

    for(var i=0; i<length; i++){
      let user = {};
      const url  = 'image0-' + data[i] + '.webp';
      user.media = '["' + url + '"]';
      user._id = data[i];
      user.name = data[i].split('-')[1];
      user.bio = 'Connect to know more.';
      users.push(user);
    }
    this.setState({users});
  }

  getChannelsList = (callback) =>{
    Realm.getRealm((realm) => {
      let channels = realm.objects('Channel').filtered('followed = "true"');
      this.process_realm_obj(channels, (result)=>{
        callback(result);
      });
    });
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  render() {
    return(
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
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
            <TouchableOpacity style = {{backgroundColor : '#fff', borderRadius : 30, width : 35, height : 35,justifyContent : 'center', alignItems : 'center', marginRight : 5}} onPress={()=>this.props.navigation.navigate('SearchScreen', {data : {type : 'profile', placeholder : 'Search people with their name like : John'}})}>
              <Icon style={{ color : 'rgb(31, 31, 92)', fontSize:25, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          refreshControl={
            <RefreshControl
              colors={['rgb(31, 31, 92)']}
              refreshing={this.state.isRefreshing}
              onRefresh={()=>this.update_profile()}
            /> }>
          <View style={{ paddingLeft : 10, paddingRight : 10, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center', marginTop : 20}}>
            <FastImage
              style={{height: 84, width: 84, borderRadius : 42, borderWidth : 1, borderColor : '#c5c5c5'}}
              source={{
                uri : this.state.loaded ? 'https://mycampusdock.com/' + this.state.user.media[0] : 'null',
                priority : FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize : 20, marginTop : 15 , textAlign : 'left', textAlignVertical : 'center',}}>{this.state.user ? this.state.user.name : 'Loading'}</Text>
            <Text style={{fontSize : 14, marginTop : 5, textAlign : 'left', textAlignVertical : 'center', color : '#a5a5a5'}}>{this.state.user ? this.state.user.email : 'Loading'}</Text>
            <Text style={{textAlign : 'center', marginTop : 10, fontSize : 14, marginLeft:15, marginRight:15,}}>{this.state.user ? '" ' + this.state.user.bio + ' "' : 'Loading...'}</Text>
            <View style={{flexDirection : 'row', marginTop : 20}}>
              <TouchableOpacity onPress = {() =>console.log('cliked 0')}>
                <View style={{backgroundColor : '#fff', borderRadius : 50, padding : 5, borderColor : '#efefef', borderWidth : 2, justifyContent : 'center', alignItems : 'center'}}>
                  <Icon name = 'chatbubbles' style={{fontSize : 28, color : 'rgb(31, 31, 92)', width : 30, height : 30, textAlign : 'center'}}/>
                </View>
              </TouchableOpacity>
              <View style={{width : 15}} />
              <TouchableOpacity onPress = {() =>console.log('cliked 1')}>
                <View style={{backgroundColor : 'rgb(31, 31, 92)', borderRadius : 50, paddingLeft : 35, paddingRight : 35, padding : 5, justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{fontSize : 18, textAlign : 'center', margin : 5, color : '#fff'}}>{'Update Profile'}</Text>
                </View>
              </TouchableOpacity>
              <View style={{width : 15}} />
              <TouchableOpacity onPress = {() =>this.props.navigation.navigate('SettingsScreen')}>
                <View style={{backgroundColor : '#fff', borderRadius : 50, padding : 5, borderColor : '#efefef', borderWidth : 2, justifyContent : 'center', alignItems : 'center'}}>
                  <Icon name = 'settings' style={{ fontSize : 28, color : 'rgb(31, 31, 92)', width : 30, height : 30, textAlign : 'center'}}/>
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={{flexDirection : 'row', marginTop : 25, marginBottom : 20}}>
              <TouchableOpacity onPress = {() =>this.props.navigation.navigate('ListScreen', {data : {type : 'channels', data : this.state.channels}})}>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{this.state.user ? this.state.user.followed_channels.length : 0}</Text>
                  <Text style={{fontSize : 14}}>{'Channels'}</Text>
                </View>
              </TouchableOpacity>
              <View style={{width : 2, backgroundColor : '#efefef', marginLeft : 20, marginRight : 20}}/>

              <TouchableOpacity onPress = {() =>this.props.navigation.navigate('ListScreen', {data : {type : 'profile', data : this.state.users}})}>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{this.state.user ? this.state.user.connections.length : 0}</Text>
                  <Text style={{fontSize : 14}}>{'Connections'}</Text>
                </View>
              </TouchableOpacity>
              <View style={{width : 2, backgroundColor : '#efefef', marginLeft : 20, marginRight : 20}}/>
              
              <TouchableOpacity onPress = {() =>this.props.navigation.navigate('ListScreen', {data : {type : 'home', data : this.state.events}})}>
                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{this.state.events ? this.state.events.length : 0}</Text>
                  <Text style={{fontSize : 14}}>{'Events'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

ProfileScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(ProfileScreen);