import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';

class FlatCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      card : '',
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
    const dimensions = Dimensions.get('window');
    return (
      <TouchableWithoutFeedback onPress={ () => this.props.onPress(this.props.data, this.card)}>
        <View ref={(viewRef) => this.card = viewRef} style = {{height : 220, width: 0.6 * dimensions.width, marginLeft : 20, marginBottom : 10, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 6, backgroundColor: 'black', borderRadius:10}}>
          <View >
            <View>
              <FastImage
                style={{height : 220, width : '100%', position :'absolute',  borderRadius:10}}
                source={{
                  uri : this.props.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={{
                width : '100%',
                height : 220,
                top: 0
              }}>
                <View style={{margin:20, flex : 7}}>
                  <Text 
                    style={{color : '#c5c5e5', textAlign:'left', fontSize : 12, fontWeight : '500'}}>
                    {(''+this.props.channel).toUpperCase()}
                  </Text>
                  <Text 
                    style={{color : 'white', marginRight : 10, marginTop : 5, fontSize : 22, fontWeight : '600'}}>
                    {this.props.title}
                  </Text>
                </View>
                <View style={{flex : 1, marginLeft : 20, marginBottom:10, marginRight :20}}>
                  <Text style={{color : '#efefef', fontSize : 12, fontWeight : '500'}} ellipsizeMode='tail' numberOfLines={1}>
                    { this.parseDate(this.props.data.date) + ' • ' + this.parseTime(this.props.data.date)+ ' • ' + this.props.data.location}
                  </Text>
                </View>
              </View>
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