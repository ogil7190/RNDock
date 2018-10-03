import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import FlatCardList from './components/FlatCardList';
import Realm from '../realmdb';

class ChannelDetailScreen extends Component {
  state={
    isRefreshing : false,
    events : null,
    email : null,
    token : null,
    channel : '',
  }

  static navigationOptions = {
    tabBarVisible : false,
  }

  async UNSAFE_componentWillMount(){
    const str = await AsyncStorage.getItem('data');
    let data = JSON.parse(str);
    const email = data.data.email;
    const token = data.token;
    if( token === null) return;
    if(this.state.token == null)
      this.setState({token, email});
  }

  handlePress = (item, data, index) =>{
    if(data){
      if(this.state.activities[index].type === 'poll'){
        this.markPoll(item, data.key, index);
      }
    }
  }

  markPoll = (item, key, index) =>{
    axios.post('https://mycampusdock.com/channels/make-poll', { _id : item._id, option : key}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      console.log(response);
      var oldActivites = this.state.activities;
      oldActivites[index].options[key].push(this.state.email);
      this.setState({activities : oldActivites});
    });
  }
  
  fetch_events = (channel) =>{
    Realm.getRealm((realm) => {
      let events = realm.objects('Events').filtered('channel = "'+channel._id +'"').sorted('timestamp', true);
      this.process_realm_obj(events, (result) =>{
        if(this.state.events === null){
          this.setState({events : result, channel : channel});
        }
      });
    });
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  unfollow = () =>{
    axios.post('https://mycampusdock.com/channels/user/unfollow', {channel_id : this.state.channel._id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.error)
        this.fetch_data(this.state.channel._id, 'NONE');
    }).catch(e =>{
      console.log('error', e);
    });
  }

  follow = () =>{
    axios.post('https://mycampusdock.com/channels/user/follow', {channel_id : this.state.channel._id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.error)
        this.fetch_data(this.state.channel._id, 'NONE');
    }).catch(e =>{
      console.log('error', e);
    });
  }

  handleFollowPress = () =>{
    if(!this.state.channel.followed){
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

  getHeader = () =>{
    if(this.state.isRefreshing){
      return (<ActivityIndicator style={{margin : 5}} size="small" color="rgb(31, 31, 92)" animating={this.state.isRefreshing}/>);
    }
    if(this.state.channel.followed){
      return(
        <View style={{flex : 1}}>
          <View style={{backgroundColor : '#fff', flexDirection : 'row', borderWidth : 0.5, borderColor : '#cfcfcf'}}>
            <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,}} onPress={()=>this.props.navigation.navigate('ChannelActivity', {channel : this.state.channel})}>
              <Icon name = 'pulse' style={{margin : 4, color : '#cfcfcf'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,}}>
              <Icon name = 'albums' style={{margin : 4, color : 'rgb(31, 31, 92)'}}/>
            </TouchableOpacity>
          </View>
          <View style={{flex : 1}}>
            <FlatList
              style={{backgroundColor : 'rgb(250, 250, 250)', paddingLeft : 20, paddingRight : 20, paddingTop : 10}}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.events}
              renderItem={({item}) => <FlatCardList image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title}channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
          </View>
        </View>);
    } else {
      return (
        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
          <View style={{width : 100, height : 100, borderWidth : 3, borderRadius : 50, borderColor : '#c5c5c5', padding : 5}}>
            <Icon name = 'lock' style={{fontSize : 80, textAlign : 'center', color : '#c5c5c5'}}/>
          </View>
          <Text style={{fontSize : 15, color : '#c5c5c5', textAlign : 'center', margin : 10}}>Follow the channel to see the content</Text>
        </View>
      );
    }
  }
  
  render() {
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
    const channel = navigation.getParam('channel', undefined);
    if( channel !== undefined){
      this.fetch_events(channel);
    }
    return(
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>
        <View style={{padding : 20, backgroundColor : '#fff'}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <FastImage
              style={{height: 72, width: 72, borderRadius : 40,}}
              source={{
                uri : item.image,
                priority : FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize : 18, textAlign : 'left', textAlignVertical : 'center', marginLeft : 10}}>{item.name}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <Text style={{textAlign : 'center'}}>{this.state.channel.description}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{this.state.isRefreshing ? 'Loading' : this.state.channel.followers}</Text>
              <Icon name = 'people' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5, justifyContent : 'center'}} onPress = {this.handleFollowPress}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{ this.state.isRefreshing ? 'Loading' : this.state.channel.followed ? 'Following' : 'Tap to Add'}</Text>
              <Icon name = {this.state.channel.followed ? 'checkmark' : 'lock' } style={{margin : 5, fontSize : 25}}/>
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
        {this.getHeader()}
      </View>
    );
  }
}

ChannelDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default ChannelDetailScreen;