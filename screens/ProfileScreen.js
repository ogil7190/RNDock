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
      loaded : false
    };
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount(){
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    console.log('data');
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
          style = {{backgroundColor: 'transparent'}}>
          <View>
            <View style={{justifyContent : 'center', alignContent : 'center', flexDirection : 'row'}}>
              <FastImage
                style={{borderRadius : 50, width : 100, height : 100, margin : 15}}
                source={{
                  uri : this.state.loaded ? this.state.user.media.length > 0 ? 'https://mycampusdock.com/' + this.state.media[0] : this.state.user.pic : 'none',
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <Text style={{fontSize : 18, textAlign : 'center', flexDirection : 'row'}}>{this.state.user.name}</Text>
            <Text style={{fontSize : 18, marginTop : 10, color : '#c5c5c5', textAlign : 'center', flexDirection : 'row'}}>{this.state.user.email}</Text>
            <Text style={{fontSize : 18, marginTop : 10, color : '#c5c5c5', textAlign : 'center', flexDirection : 'row'}}>{this.state.user.mobile}</Text>
            <Text style={{fontSize : 18, marginTop : 10, color : '#c5c5c5', textAlign : 'center', flexDirection : 'row'}}>{this.state.user.college}</Text>
            <TouchableOpacity style={{backgroundColor : 'rgb(31, 31, 92)', margin : 20, flexDirection : 'row', padding : 5, borderRadius : 10}}>
              <Text style={{textAlign : 'center', flex : 1, color : '#fff', fontSize : 15, margin : 5}} onPress={()=>this.unsaveUser()}>LOGOUT</Text>
            </TouchableOpacity>
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