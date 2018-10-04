import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity, AsyncStorage, FlatList, Platform } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import User from './components/User';

class ChannelUsersScreen extends Component {
  state = {
    token : null,
    tab : 0,
    channel : null,
    users : []
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount(){
    const { navigation } = this.props;
    const channel = navigation.getParam('channel', {});
    this.setState({channel});
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    if( token === null) return;
    axios.post('https://mycampusdock.com/channels/user/fetch-channel-users', { channel_id : channel._id }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      console.log(response.data.data);
      this.setState({users : response.data.data});
    });
  }

  render() {
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>
        { this.state.channel ? 
          <View>
            <View style = {{ backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, justifyContent : 'center', alignItems : 'center'}}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <TouchableOpacity onPress = {()=>goBack()} style= {{padding : 5, marginLeft : 10}}>
                  <Icon name="arrow-back" style={{ color: 'red', fontSize: 30, textAlign : 'center'}}/>
                </TouchableOpacity>
                <Text style={{fontSize :20, textAlign : 'center', flex : 1, textAlignVertical : 'center', paddingRight : 20,  alignContent : 'center'}}>{this.state.channel ? this.state.channel.name : 'Channel'}</Text>
              </View>
            </View>
            <View style={{padding : 20, backgroundColor : '#fff', }}>
              <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <FastImage
                  style={{height: 72, width: 72, borderRadius : 40,}}
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
            </View>
            <FlatList
              style={{backgroundColor : '#fff', marginTop : 2}}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.users}
              renderItem={(item)=> <User data = {item} />} /> 
          </View>
          : <View/> }
      </View>
    );
  }
}

ChannelUsersScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default ChannelUsersScreen;