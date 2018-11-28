import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class EventTile extends Component {
  constructor(props){
    super(props);
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

  parseTime = (timestamp) =>{
    const curent = new Date(timestamp);
    var hours = curent.getHours();
    var mins = curent.getMinutes();
    var duration = 'AM';
    if(hours>12){
      hours = hours - 12;
      duration = 'PM';
    }
    return hours + ':' +mins + ' ' + duration;
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
            <Text numberOfLines = {2} ellipsizeMode = 'tail' style={{fontSize : 16, margin : 5}}>{item.title}</Text>
            <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 14, margin : 5, color : '#a5a5a5'}}>{item.category}</Text>
            <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 14, margin : 5}}>{this.parseDate(item.date)}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

EventTile.propTypes = {
  data : PropTypes.object.isRequired,
  onClick : PropTypes.func.isRequired
};

export default EventTile;