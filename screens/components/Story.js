import React, { Component } from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-ionicons';

class Story extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }; 
  }

  getPostType = (item) =>{
    item.message = 'New video upcoming, tomorrow evening! Hell Yeah! About me huh! Lets get started boy! #GET_SHIT_DONE';
    let size = item.message.split(' ').length / 2;
    return(
      <LinearGradient colors={['rgb(224, 62, 99)', 'rgb(224, 62, 99)', 'rgb(240, 120, 57)']}  style={{backgroundColor : 'red', flex : 1, justifyContent : 'center', alignItems : 'center', borderRadius : 5}}>
        <Text style={{fontSize : 18 - 1 * size, padding : 5, color : '#fff', textAlign : 'center',}}>{item.message}</Text>
      </LinearGradient>
    );
  }

  getPostImgType = (item) =>{
    return(
      <FastImage
        style={{flex : 1, borderRadius : 5}}
        source={{
          uri : 'https://mycampusdock.com/' + item.media[0],
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  }

  getPollType = (item) =>{
    let size = item.message.split(' ').length / 2;
    return(
      <LinearGradient colors={['rgb(224, 62, 99)', 'rgb(224, 62, 99)', 'rgb(240, 120, 57)']}  style={{backgroundColor : 'red', flex : 1, justifyContent : 'center', alignItems : 'center', borderRadius : 5}}>
        <View style={{width : 35, height : 35, borderRadius : 20, borderWidth : 1, justifyContent : 'center', alignItems : 'center',}}><Icon name = 'stats' style={{fontSize : 30,}}/></View>
        <Text style={{fontSize : 18 - 1 * size, padding : 5, color : '#fff', textAlign : 'center', marginLeft : 3, marginRight : 3}}>{item.message}</Text>
      </LinearGradient>
    );
  }

  renderWithTypes = (item) =>{
    switch(item.item.type){
    case 'post' :
      return this.getPostType(item.item);
    case 'post-image':
      return this.getPostImgType(item.item);
    case 'poll' :
      return this.getPollType(item.item);
    }
  }

  render() {
    const item = this.props.data;
    const dim = Dimensions.get('window');
    return(
      <TouchableOpacity style={{width : dim.width / 3 - 4, height : dim.width / 3 + 40, margin : 2, shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3}} onPress = {this.props.onPress}>
        {this.renderWithTypes(item)}
      </TouchableOpacity>
    );
  }
}
Story.propTypes = {
  data : PropTypes.object.isRequired,
  onPress : PropTypes.func.isRequired
};

export default Story;