import React, { Component } from 'react';
import { View, Dimensions,Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

class FlatCardChannel extends Component {
  constructor(props){
    super(props);
    this.state = {
      subscribed_icon : 'add-circle',
    };
  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <TouchableOpacity onPress={()=>this.props.onPress()}>
        <View style = {{height : 100, width : 0.45 * dimensions.width, marginLeft : 20, marginBottom :10, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 6, backgroundColor: 'black', borderRadius:8}}>
          <View style = {{borderRadius : 8, overflow:'hidden'}}>
            <View>
              <FastImage
                style={{height: 100, width: '100%', flex: 1, position :'absolute'}}
                source={{
                  uri : this.props.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={{
                width : '100%',
                height : 100,
                top: 0
              }}>
                <View style={{flexDirection :'row', marginLeft :15, marginRight : 15, marginTop:10, flex : 3}}>
                  <Text 
                    style={{color : 'white', flex:1, textAlign:'left', fontSize : 12, fontWeight : '500'}}>
                    {(''+this.props.channel).toUpperCase()}
                  </Text>
                </View>
                <View style={{flex : 2}}>
                  <Text 
                    ellipsizeMode='tail' 
                    numberOfLines={1}
                    style={{color : 'white', marginLeft : 15, marginRight : 15, fontSize : 14}}>
                    {this.props.title}
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
  image : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  data : PropTypes.string.isRequired,
  url : PropTypes.string.isRequired,
  channel : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired
};

export default FlatCardChannel;