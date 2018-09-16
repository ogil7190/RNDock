import React, { Component } from 'react';
import {Text, View, Platform, AsyncStorage, Image, ActionSheetIOS, TextInput, StatusBar, Picker, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';

class CheckOutEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = {
    header: null,
  };

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
    const { navigation } = this.props;
    const item = navigation.getParam('item', {});
    const {goBack} = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>
        <View style = {{ backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, flex : 1}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <TouchableOpacity onPress = {()=>goBack()} style= {{marginTop : 15, marginLeft : 5}}>
              <Icon name="arrow-back" style={{ color: '#000', fontSize: 30}}/>
            </TouchableOpacity>
            <Text style={{fontSize :20, textAlign : 'center', flex : 1, textAlignVertical : 'center', alignContent : 'center'}}>{'Checkout Now'}</Text>
          </View>
          <ScrollView
            scrollEventThrottle={5}>
            <View style={{flexDirection : 'row', marginTop: 15, padding : 10, backgroundColor : '#fff'}}>
              <View style={{marginLeft : 15, marginTop : 10, flex : 3}}>
                <Text style={{fontSize : 18}}>{item.title}</Text>
                <Text style={{fontSize : 15, color : '#c5c5c5', marginTop : 5}}>{'Event by '+ (''+item.channel).toUpperCase()}</Text>
                <Text style={{fontSize : 15,marginTop : 5}}>{this.parseDate(item.date)}</Text>
                <Text style={{fontSize : 15,marginTop : 5}}>{this.parseTime(item.date)}</Text>
                <Text style={{fontSize : 15,marginTop : 5}}>{item.location}</Text>
                <Text style={{fontSize : 15, color : '#000', marginTop : 10, fontWeight :'500'}}>{'X 1 Seat'}</Text>
              </View>
              <View style={{flex : 1, marginTop : 20}}>
                <FastImage
                  style={{ width: 72, height: 72,borderRadius : 10}}
                  source={{
                    uri : 'https://mycampusdock.com/' + JSON.parse(item.media)[0],
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            </View>
            <View style={{ marginTop : 30, backgroundColor : '#fff', padding : 15}}>
              <Text style={{fontSize : 18, marginLeft : 15, marginRight : 15, marginBottom : 5}}>{'100% Refund on Cancellation'}</Text>
              <Text style={{color : '#123', fontSize :15, marginRight : 15,marginLeft : 15,}}>{'Full refund on every purchase made on Dock at the time of cancelllation before event started.'}</Text>
            </View>


            <View style={{ marginTop : 30, backgroundColor : '#fff', padding : 15}}>
              <Text style={{fontSize : 18, marginLeft : 15, marginRight : 15, marginBottom : 10, fontWeight : '500'}}>{'Payment Summary'}</Text>
              <Text style={{fontSize : 16, marginLeft : 15, marginRight : 15, marginBottom : 5}}>{'Event Subtotal'}</Text>
              <View style={{flexDirection : 'row'}}><Text style={{color : '#333', fontSize :15, marginRight : 15,marginLeft : 15,flex : 1}}>{'Price of Event X 1'}</Text><Text>{'₹'+item.price}</Text></View>
              <View style={{flexDirection : 'row', marginTop : 5}}><Text style={{color : '#333', fontSize :15, marginRight : 15,marginLeft : 15,flex : 1}}>{'Discount Given'}</Text><Text>{'₹'+item.price}</Text></View>
              <View style={{flexDirection : 'row', marginTop : 10}}><Text style={{color : '#123', fontSize :16, fontWeight : '500', marginRight : 15,marginLeft : 15,flex : 1}}>{'Total'}</Text><Text>{'₹0.0'}</Text></View>
            </View>

            <TouchableOpacity style={{backgroundColor :'rgb(31, 31, 92)', borderRadius : 15, marginTop:30, justifyContent : 'center', alignSelf : 'center'}} onPress = {()=>console.log('Clicked!')}>
              <Text style={{color : '#fff', fontSize :18, margin : 5, padding : 5}}>{'Proceed to Pay ₹0.0'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

CheckOutEvent.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default CheckOutEvent;