import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class UserTile extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const item = this.props.data;
    return (
      <View>
        <TouchableOpacity style={{flexDirection : 'row', backgroundColor : '#efefef', marginLeft : 10, marginRight : 10, marginBottom : 1, marginTop : 1, borderWidth : 1, borderColor : '#c5c5c5', borderRadius : 8}} onPress={()=>this.props.onClick()}>
          <FastImage
            style={{ width: 64, height: 64, backgroundColor : '#c5c5c5', borderRadius : 35, margin : 10}}
            source={{
              uri : 'https://mycampusdock.com/' + JSON.parse(item.media)[0],
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View>
            <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 16, margin : 5}}>{item.name}</Text>
            <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 14, color : '#a5a5a5', marginRight : 10, margin : 5,}}>{item.bio}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

UserTile.propTypes = {
  data : PropTypes.object.isRequired,
  onClick : PropTypes.func.isRequired
};

export default UserTile;