import React, { Component } from 'react';
import {Text, View, StatusBar, Alert, AsyncStorage, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';

class UserPreview extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    connected : 0
  }

  static navigationOptions = {
    header: null,
  };

  handleConnect = () =>{
    if(this.state.connected === 1){
      this.showDisconnectAlert();
    }
    else if(this.state.connected === 2){
      this.showCancelAlert();
    }
    else if(this.state.connected === 2){
      this.accept();
    }
  }

  showDisconnectAlert = () =>{
    Alert.alert(
      'Are you sure you want to remove this user ?',
      'You will no longer see more content from this user.',
      [
        {text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel'},
        {text: 'Remove User', onPress: () => this.disconnect()},
      ],
      { cancelable: true });
  }

  showCancelAlert = () =>{
    Alert.alert(
      'Are you sure you want to cancel this request?',
      'You can send request again to this user.',
      [
        {text: 'Close', onPress: () => console.log('Canceled'), style: 'cancel'},
        {text: 'Cancel Request', onPress: () => this.cancel()},
      ],
      { cancelable: true });
  }

  disconnect = () =>{

  }

  cancel = () =>{

  }

  accept = () =>{

  }

  async componentDidMount(){
    const user_data = this.props.navigation.getParam('data', {});
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const connections = data.data.connections;
    console.log(connections, user_data);
    if(connections.includes(user_data._id)){
      return this.setState({connected : 1});
    }
    const sent_requests = data.data.sent_connection_requests;
    if(sent_requests.includes(user_data._id)){
      return this.setState({connected : 2});
    }
    const connection_requests = data.data.connection_requests;
    if(connection_requests.includes(user_data._id)){
      return this.setState({connected : 3});
    }
  }

  enable = (bool) =>{
    let res = {};
    if(bool === 1){
      res.color = 'rgb(31, 31, 92)';
      res.button_text = 'Connect';
      res.icon = 'lock';
      res.hint = 'You are not connected to this user.';
      res.width = 3;
      return res;
    }
    res.color = 'rgb(31, 31, 92)';
    res.button_text = 'Requested';
    res.icon = 'lock';
    res.hint = 'You have sent the request to this user, wait for them to respond.';
    res.width = 3;
    return res;
  }

  disable = (bool) =>{
    let res = {};
    if(bool === 1){
      res.color = 'orange';
      res.button_text = 'Connected';
      res.icon = 'happy';
      res.hint = 'You are already a connection with this user.';
      res.width = 0;
      return res;
    }
    res.color = 'orange';
    res.button_text = 'Accept Request';
    res.icon = 'flash';
    res.hint = 'Do you want to connect to this user?';
    res.width = 0;
    return res;
  }

  render() {
    const data = this.props.navigation.getParam('data', {});
    const {goBack} = this.props.navigation;
    let something = {};
    switch(this.state.connected){
    case 0 : something = this.enable(1); break;
    case 1 : something = this.disable(1); break;
    case 2 : something = this.enable(0); break;
    case 3 : something = this.disable(0); break;
    }
    const color = something.color;
    const button_text = something.button_text;
    const icon = something.icon;
    const hint = something.hint;
    const width = something.width;

    return(
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>

        <View style = {{ flexDirection : 'row', backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20}}>
          <View>
            <TouchableOpacity onPress = {()=>goBack()} style= {{flexDirection : 'row', marginLeft : 5, marginRight : 5,  alignItems : 'center'}}>
              <Icon name="arrow-back" style={{ fontSize: 25, margin : 5}}/>
              <Text style={{fontSize : 18, marginLeft : 5}}>{'Back'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex : 1}} />

          <TouchableOpacity onPress = {()=>goBack()} style= {{padding : 5, marginRight : 10,}}>
            <Icon name="more" style={{ fontSize: 30}}/>
          </TouchableOpacity>
        </View>

        <View style={{ paddingLeft : 10, paddingRight : 10, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center', marginTop : 20}}>
          <FastImage
            style={{height: 96, width: 96, borderRadius : 60, borderWidth : 1, borderColor : '#c5c5c5'}}
            source={{
              uri : 'https://mycampusdock.com/' + JSON.parse(data.media)[0],
              priority : FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={{fontSize : 20, marginTop : 15 , textAlign : 'left', textAlignVertical : 'center',}}>{data.name}</Text>
          <Icon name = {data.gender === 'M' ? 'male' : 'female'} style={{color : 'orange', fontSize : 20, margin : 5}}/>
          <Text style={{textAlign : 'center', marginTop : 10, fontSize : 14, marginLeft:15, marginRight:15,}}>{data.bio}</Text>
          <View style={{flexDirection : 'row', marginTop : 20}}>
            <TouchableOpacity onPress = {() =>console.log('cliked 0')}>
              <View style={{backgroundColor : '#fff', borderRadius : 50, padding : 5, borderColor : '#efefef', borderWidth : 2, justifyContent : 'center', alignItems : 'center'}}>
                <Icon name = 'chatbubbles' style={{fontSize : 28, color : 'rgb(31, 31, 92)', width : 30, height : 30, textAlign : 'center'}}/>
              </View>
            </TouchableOpacity>
            <View style={{width : 15}} />
            <TouchableOpacity onPress = {() => this.handleConnect()}>
              <View style={{backgroundColor : color, borderRadius : 50, paddingLeft : 35, paddingRight : 35, padding : 5, justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontSize : 18, textAlign : 'center', margin : 5, color : '#fff'}}>{button_text}</Text>
              </View>
            </TouchableOpacity>
            <View style={{width : 15}} />
            <TouchableOpacity onPress = {() =>console.log('cliked 2')}>
              <View style={{backgroundColor : '#fff', borderRadius : 50, padding : 5, borderColor : '#efefef', borderWidth : 2, justifyContent : 'center', alignItems : 'center'}}>
                <Icon name = 'settings' style={{ fontSize : 28, color : 'rgb(31, 31, 92)', width : 30, height : 30, textAlign : 'center'}}/>
              </View>
            </TouchableOpacity>
          </View>
            
          {/* <View style={{flexDirection : 'row', marginTop : 25, marginBottom : 20}}>
            <TouchableOpacity onPress = {() =>console.log('cliked 4')}>
              <View style={{justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{this.state.user ? this.state.user.followed_channels.length : 0}</Text>
                <Text style={{fontSize : 14}}>{'Channels'}</Text>
              </View>
            </TouchableOpacity>
            <View style={{width : 2, backgroundColor : '#efefef', marginLeft : 20, marginRight : 20}}/>

            <TouchableOpacity onPress = {() =>console.log('cliked 3')}>
              <View style={{justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{5}</Text>
                <Text style={{fontSize : 14}}>{'Connections'}</Text>
              </View>
            </TouchableOpacity>
            <View style={{width : 2, backgroundColor : '#efefef', marginLeft : 20, marginRight : 20}}/>
              
            <TouchableOpacity onPress = {() =>console.log('cliked 5')}>
              <View style={{justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : 'rgb(31, 31, 92)', fontSize : 25}}>{this.state.events ? this.state.events.length : 0}</Text>
                <Text style={{fontSize : 14}}>{'Events'}</Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
          <View style={{width : 100, height : 100, borderWidth : width, borderRadius : 50, borderColor : '#777777', padding : 10, justifyContent : 'center', alignItems : 'center'}}>
            <Icon name = {icon} style={{fontSize : 64, color : '#777777', textAlign : 'center',}}/>
          </View>
          <Text style={{fontSize : 15, color : '#777777', textAlign : 'center',marginLeft : 20, margin : 5, marginRight : 20}}>{hint}</Text>
        </View>
      </View>
    );
  }
}

UserPreview.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default UserPreview;