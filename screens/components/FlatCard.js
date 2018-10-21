import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class FlatCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      card : '',
      isSpecial : false
    };
  }

  card = '';

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
      <TouchableWithoutFeedback onPress={ () => this.props.onPress(this.props.data, this.card)}>
        <View ref={(viewRef) => this.card = viewRef} style = {{height : 400,  marginBottom : 15, shadowOpacity : 0.4, shadowOffset : {width : 1, height : 1}, elevation : 6, backgroundColor: 'black', borderRadius:15, marginRight : 15, marginLeft : 15, margin : 10}}>
          <View >
            <View>
              <FastImage
                style={{height: 400, width: '100%', flex: 1, position :'absolute',  borderRadius:15}}
                source={{
                  uri : this.props.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{
                width : '100%',
                height : 400,
                top: 0
              }}>
                <View style={{margin:20, flex : 10}}>
                  <Text 
                    style={{color : '#c5c5e5', textAlign:'left', fontSize : 15,}}>
                    {(''+this.props.channel).toUpperCase()}
                  </Text>
                  <Text 
                    style={{color : 'white', marginRight : 10, marginTop : 10, fontSize : 30,}}>
                    {this.props.title}
                  </Text>
                </View>
                <View style={{flex : 1, marginLeft : 20, marginBottom:10, marginRight :20}}>
                  <Text style={{color : '#efefef', fontSize : 15,}} ellipsizeMode='tail' numberOfLines={1}>
                    { this.parseDate(this.props.data.date) + ' • ' + this.parseTime(this.props.data.date)+ ' • ' + this.props.data.location}
                  </Text>
                </View>
              </View>
              { this.state.isSpecial ? <Image source={require('../images/ribbon.png')} style={{position : 'absolute', right : 0, top : 0, width : 56, height : 56}} />  : <View/>}
            </View>
          </View>
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
  onPress : PropTypes.func.isRequired
};

export default FlatCard;