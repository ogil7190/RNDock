import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

class FlatCardChannel extends Component {
  constructor(props){
    super(props);
    this.state = {
      subscribed_icon : 'add-circle',
      isSpecial : false
    };
  }

  render() {
    return (
      <TouchableOpacity onPress={()=>this.props.onPress()}>
        <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 40}}>
          <View style={{width : 64, height : 64, padding : 5, backgroundColor : '#dfdfdf', borderRadius : 40}}>
            <FastImage
              style={{flex: 1, borderRadius : 40}}
              source={{
                uri : 'https://mycampusdock.com/' + JSON.parse(this.props.data.media)[0]
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <Text ellipsizeMode = 'tail' numberOfLines = {1} style={{margin : 2, textAlign : 'center', maxWidth : 80, fontSize : 12}}>{this.props.data.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

FlatCardChannel.propTypes = {
  data : PropTypes.object.isRequired,
  onPress : PropTypes.func.isRequired
};

export default FlatCardChannel;


/*
  <View style = {{height : 70, width : 120, shadowOpacity : 0.3, shadowOffset : {width : 1, height : 3}, elevation : 3, backgroundColor: 'black', borderRadius:8, marginBottom : 5, marginTop : 5}}>
          <View style = {{borderRadius : 10, overflow:'hidden'}}>
            <View>
              <FastImage
                style={{height: 70, width: '100%', flex: 1, position :'absolute'}}
                source={{
                  uri : 'https://mycampusdock.com/' + JSON.parse(this.props.data.media)[0]
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.4)']} style={{
                width : '100%',
                height : 70,
                top: 0
              }}>
                <View style={{marginLeft :5, marginRight : 5, marginTop:10, flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                  <Text
                    numberOfLines = {1}
                    ellipsizeMode = 'tail'
                    style={{color : '#fff', fontSize : 14, marginTop : 25,}}>
                    {(''+this.props.data.name).toUpperCase()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
*/