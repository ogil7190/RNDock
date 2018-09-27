import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity, ActivityIndicator, ScrollView, FlatList, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import Story from './components/Story';

class ChannelDetailScreen extends Component {
  state={
    isRefreshing : false,
    sorted_activities : null,
    email : null,
    token : null,
    channel : '',
  }

  static navigationOptions = {
    tabBarVisible : false,
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

  fetch_data = (channel, last_updated) => {
    console.log(channel);
    this.setState({isRefreshing : true});
    axios.post('https://mycampusdock.com/channels/user/fetch-channel', { channel }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      console.log(response);
      if(!response.data.error){
        this.setState({channel : response.data.data });
        if(response.data.data.subscribed){
          this.fetch_activity(last_updated, channel);
        } 
        else {
          this.setState({ isRefreshing: false });
        }
      }
    }).catch(err =>{
      console.log(err);
      this.setState({ isRefreshing: false });
    });
  }

  fetch_activity = (last_updated, channel) =>{
    axios.post('https://mycampusdock.com/channels/get-activity', { last_updated, channel }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(!response.data.error) {
        this.handleResponse(response.data.data.reverse());
      }
    } )
      .catch( err => {
        console.log(err);
      })
      .then( () => {
        this.setState({ isRefreshing: false });
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
    console.log(sorted_activities);
    this.setState({sorted_activities}); 
  }

  async UNSAFE_componentWillMount(){
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const email = data.data.email;
    const token = data.token;
    if( token === null) return;
    if(this.state.token == null)
      this.setState({token, email});
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
    if(this.state.sorted_activities === null)
      this.fetch_data(item.channel, 'NONE');
  }

  handlePress = (item, data, index) =>{
    if(data){
      if(this.state.activities[index].type === 'poll'){
        this.markPoll(item, data.key, index);
      }
    }
  }

  handleSusbcribe = () =>{
    if(!this.state.channel.subscribed){
      axios.post('https://mycampusdock.com/channels/user/susbcribe', {channel : this.state.channel._id}, {
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
  }

  markPoll = (item, key, index) =>{
    axios.post('https://mycampusdock.com/channels/make-poll', { _id : item._id, option : key}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      console.log(response);
    });
  }

  getHeader = () =>{
    if(this.state.isRefreshing){
      return (<ActivityIndicator style={{margin : 5}} size="small" color="rgb(31, 31, 92)" animating={this.state.isRefreshing}/>);
    }
    if(this.state.channel.subscribed){
      return(
        <View style={{flex : 1}}>
          <View style={{backgroundColor : '#fff', flexDirection : 'row', borderWidth : 0.5, borderColor : '#cfcfcf'}}>
            <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2}}>
              <Icon name = 'pulse' style={{margin : 4, color : 'rgb(31, 31, 92)'}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,}} onPress={()=>this.props.navigation.navigate('ChannelEvents', {channel : this.state.channel})}>
              <Icon name = 'albums' style={{margin : 4, color : '#cfcfcf'}}/>
            </TouchableOpacity>
          </View>
          <ScrollView style={{flex : 1}}>
            {
              Object.entries(this.state.sorted_activities).map((data, index) =>
                <View  key= {index} style={{backgroundColor : 'rgb(250, 250, 250)'}}>
                  <View style={{flexDirection : 'row', margin : 10}}>
                    <View style={{backgroundColor : '#efefef', shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3, borderRadius : 20, paddingRight : 10, paddingLeft : 10}} >
                      <Text style={{fontSize : 15, padding : 5, paddingRight : 10, paddingLeft : 10}}>{data[0]}</Text>
                    </View>
                    <View style={{flex : 1}}/>
                    <TouchableOpacity style={{width : 35, backgroundColor : '#efefef', shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3, borderRadius : 20, justifyContent : 'center'}} onPress={()=>this.props.navigation.navigate('PreviewStory', {item : data[1]})}>
                      <Text style={{fontSize : 15, textAlign : 'center', paddingLeft : 3}}><Icon name='play' style={{fontSize : 30}} /></Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    style={{backgroundColor : 'rgb(250, 250, 250)', paddingTop : 10}}
                    keyExtractor={(item, index) => index.toString()}
                    data={data[1]}
                    numColumns = {3}
                    renderItem={(item)=> <Story data = {item} onPress={()=>this.props.navigation.navigate('PreviewStory', {item : [item]})}/>} /> 
                </View>
              )
            }
          </ScrollView>
        </View>);
    } else {
      return (
        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
          <View style={{width : 100, height : 100, borderWidth : 3, borderRadius : 50, borderColor : '#c5c5c5', padding : 5}}>
            <Icon name = 'lock' style={{fontSize : 80, textAlign : 'center', color : '#c5c5c5'}}/>
          </View>
          <Text style={{fontSize : 15, color : '#c5c5c5', textAlign : 'center', margin : 10}}>Subscribe this channel to see their private content.</Text>
        </View>
      );
    }
  }
  
  render() {
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
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
            <Text style={{textAlign : 'center'}} numberOfLines = {2} ellipsizeMode = 'tail'>{this.state.channel.description}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{this.state.isRefreshing ? 'Loading' : this.state.channel.subscribers}</Text>
              <Icon name = 'people' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5, justifyContent : 'center'}} onPress = {()=>this.handleSusbcribe()}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{ this.state.isRefreshing ? 'Loading' : this.state.channel.subscribed ? 'Subscribed' : 'Tap to Add'}</Text>
              <Icon name = {this.state.channel.subscribed ? 'checkmark' : 'lock' } style={{margin : 5, fontSize : 25}}/>
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