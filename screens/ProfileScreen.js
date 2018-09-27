import React, { Component } from 'react';
import {Platform, View, Image, StatusBar, TouchableOpacity, Text, AsyncStorage, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user  : '',
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
    console.log(data);
    if(this.state.user === ''){
      this.setState({user : data.data, loaded : true});
    }
  }

  unsaveUser = async ()=>{
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  getRandom = () =>{
    return Math.floor(Math.random() * 10);
  }

  render() {
    console.log(this.state.user);
    return(
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
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
            <TouchableOpacity onPress={()=>this.unsaveUser()}>
              <Icon style={{ color : '#fff', fontSize:35, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{padding : 20, backgroundColor : '#fff'}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <FastImage
              style={{height: 72, width: 72, borderRadius : 40,}}
              source={{
                uri : this.state.loaded ? 'https://mycampusdock.com/' + this.state.user.media[0] : '',
                priority : FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize : 18, textAlign : 'left', textAlignVertical : 'center', marginLeft : 10}}>{this.state.user.name}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <Text style={{textAlign : 'center'}} numberOfLines = {2} ellipsizeMode = 'tail'>{'Its my fucking bio'}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5,  justifyContent : 'center'}}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{this.state.isRefreshing ? 'Loading' : '3'}</Text>
              <Icon name = 'people' style={{margin : 5, fontSize : 25}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 0.5, borderRadius : 5, margin : 3, marginLeft : 5, marginRight : 5, justifyContent : 'center'}} onPress = {()=>console.log('FUCK')}>
              <Text style={{fontSize : 15, textAlign : 'center', margin : 4}}>{ this.state.isRefreshing ? 'Loading' : 'Subscribed'}</Text>
              <Icon name = {this.state.loaded ? 'checkmark' : 'lock' } style={{margin : 5, fontSize : 25}}/>
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