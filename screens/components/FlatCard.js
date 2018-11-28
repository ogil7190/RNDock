import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import People from './People';

class FlatCard extends Component {
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
    let size = 0;
    if(this.props.title.length > 25){
      size = 20;
    }
    return (
      <TouchableWithoutFeedback onPress={ () => this.props.onPress()}>
        <View style={{marginLeft : 15, marginRight : 15, margin : 10}}>
          <View style={{height : 400, width : '100%', shadowOpacity : 0.4, shadowOffset : {width : 2, height : 4}, elevation : 6, padding : 2,}}>
            <View style={{flex : 8}}>
              <FastImage
                style ={{flex : 1, borderTopLeftRadius : 15, borderTopRightRadius : 15}}
                source={{
                  uri : this.props.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={{flex : 2, flexDirection : 'row'}}>
              <View style={{flex : 2, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center', borderBottomLeftRadius : 5,}}>
                <Text style={{fontSize : 30, textAlign : 'center',}}>{this.parseDate(this.props.data.date).split('-')[0]}</Text>
                <Text style={{fontSize : 18, color : 'orange', textAlign : 'center',}}>{this.parseDate(this.props.data.date).split('-')[1]}</Text>
              </View>
              <View style={{flex : 7, backgroundColor : '#fff', borderBottomRightRadius : 5,}}>
                <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 16, marginLeft : 8, marginRight : 8, marginTop : 5}}>{'at ' + this.parseTime(this.props.data.date)}</Text>
                <Text numberOfLines = {1} ellipsizeMode = 'tail' style={{fontSize : 16, marginLeft : 8, marginRight : 8}}>{'in ' + this.props.data.location}</Text>
                <People data = {[]} count = {this.props.data.enrollees} style={{marginLeft : 8, marginRight : 8, marginTop : 3}} text = {this.props.data.enrollees > 0 ? this.props.data.enrollees + ' people are going' : 'Check out this latest event!'}/>
              </View>
            </View>
          </View>
          <View style={{position : 'absolute', top : 25, left : 20,}}>
            <Text style={{color : '#cfcfcf', textAlign:'left', fontSize : 16}}>{(''+this.props.channel).toUpperCase()}</Text>
          </View>

          <View style={{position : 'absolute', top : 270 - size, left : 10,}}>
            <Text numberOfLines = {2} ellipsizeMode = 'tail' style={{ color : '#fff', fontSize : 28, marginLeft : 5, marginRight : 5,}}>{this.props.title}</Text>
          </View>
          { this.state.isSpecial ? <Image source={require('../images/ribbon.png')} style={{position : 'absolute', right : 0, top : 0, width : 56, height : 56}} />  : <View/>}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FlatCard.propTypes = {
  image : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  data : PropTypes.object.isRequired,
  channel : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired,
  isSpecial : PropTypes.bool
};

export default FlatCard;