import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
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
    const dimensions = Dimensions.get('window');
    return (
      <TouchableOpacity onPress={()=>this.props.onPress()}>
        <View style = {{height : 75, width : 0.32 * dimensions.width, marginLeft : 15, marginRight : -5, shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3, backgroundColor: 'black', borderRadius:10}}>
          <View style = {{borderRadius : 10, overflow:'hidden'}}>
            <View>
              <FastImage
                style={{height: 75, width: '100%', flex: 1, position :'absolute'}}
                source={{
                  uri : 'https://mycampusdock.com/' + JSON.parse(this.props.data.media)[0]
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']} style={{
                width : '100%',
                height : 75,
                top: 0
              }}>
                <View style={{marginLeft :5, marginRight : 5, marginTop:10, flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                  <Text
                    numberOfLines = {1}
                    ellipsizeMode = 'tail'
                    style={{color : '#fff', fontSize : 14, marginTop : 30,}}>
                    {(''+this.props.data.name).toUpperCase()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

FlatCardChannel.propTypes = {
  data : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired
};

export default FlatCardChannel;