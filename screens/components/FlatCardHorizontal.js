import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class FlatCardHorizontal extends Component {
  constructor(props){
    super(props);
    this.state = {
      isSpecial : props.isSpecial
    };
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
    return (
      <TouchableWithoutFeedback onPress={ () => this.props.onPress()}>
        <View style={{marginTop : 5, marginBottom : 5, margin : 2}}>
          <View style={{height : 220, width : 280, shadowOpacity : 0.4, shadowOffset : {width : 1, height : 3}, elevation : 6,}}>
            <View style={{flex : 6}}>
              <FastImage
                style ={{flex : 1, borderTopLeftRadius : 10, borderTopRightRadius : 10}}
                source={{
                  uri : this.props.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              /></View>
            <View style={{flex : 2, flexDirection : 'row', }}>
              <View style={{flex : 2, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center', borderBottomLeftRadius : 5,}}>
                <Text style={{fontSize : 25,  textAlign : 'center',}}>{this.parseDate(this.props.data.date).split('-')[0]}</Text>
                <Text style={{fontSize : 14, color : 'orange', textAlign : 'center',}}>{this.parseDate(this.props.data.date).split('-')[1]}</Text>
              </View>
              <View style={{flex : 6, backgroundColor : '#fff',  borderBottomRightRadius : 5,}}>
                <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 18, marginLeft : 5, marginRight : 5, marginTop : 5}}>{this.props.title}</Text>
                <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 14, marginLeft : 5, marginRight : 5, marginTop : 5}}>{'at ' + this.props.data.location}</Text>
              </View>
            </View>
          </View>
          <View style={{position : 'absolute', top : 15, left : 15, }}>
            <Text style={{color : '#cfcfcf', textAlign:'left', fontSize : 14}}>{(''+this.props.channel).toUpperCase()}</Text>
          </View>
          { this.state.isSpecial ? <Image source={require('../images/ribbon.png')} style={{position : 'absolute', right : 0, top : 0, width : 56, height : 56}} />  : <View/>}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FlatCardHorizontal.propTypes = {
  image : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  data : PropTypes.object.isRequired,
  channel : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired,
  isSpecial : PropTypes.bool
};

export default FlatCardHorizontal;