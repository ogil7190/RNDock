import React, { Component } from 'react';
import { Button, Text, Animated, ScrollView, View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
// import { Row } from 'native-base';
import FastImage from 'react-native-fast-image';
import { Transition } from 'react-navigation-fluid-transitions';


// For animations
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 70;

class EventDetailScreen extends Component {

  static navigationOptions = {
    header: null
  };

  state={
    scrollY: new Animated.Value(0)
  }
  monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  parseDate = (timestamp) =>{
    const curent = new Date(timestamp);
    var date = curent.getDate();
    var month = curent.getMonth();
    var year = curent.getFullYear();
    return date + '-' +this.monthNames[month] + '-' + year;
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
    console.log(item);
    const {goBack} = this.props.navigation;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });
    const imageOffset = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    const eventNameOffset = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 10 ,HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 10 + 25],
      outputRange: [-20, -20, HEADER_MIN_HEIGHT/2 - 10],
      extrapolate: 'clamp'
    });
    StatusBar.setBarStyle('light-content', true);
    return(
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"/>
        <Animated.View style={{ 
          position: 'absolute',  
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgb(31, 31, 92)',
          height: headerHeight,
          zIndex: 1
        }}>
          
          <Animated.View style={{ position: 'absolute', opacity: imageOffset, width: '100%', height: '100%' }}>
            {/* <Transition shared='event-image'> */}
              <FastImage
                style={{ width: '100%', height: '100%'}}
                // style={{height: 300, width: '100%', borderRadius:12}}
                source={{
                  uri : 'https://mycampusdock.com/' + JSON.parse(item.media)[0],
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            {/* </Transition> */}
          </Animated.View>
          <Animated.View style={{ position: 'absolute', bottom: eventNameOffset, left: 0, right: 0, alignItems: 'center'}}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.title}</Text>
          </Animated.View>
          
          <View 
            style={{
              position: 'absolute',
              top: 10,
              left: 5,
            }}>
            <Button title="back" transparent onPress={() => goBack()}>
              {/* <Icon name="arrow-back" style={{ color: '#fff', fontSize: 30}} /> */}
            </Button>
          </View>

          <View style={{ position : 'absolute', top : 10, left : 10, right : 10}}>
            
          </View>

        </Animated.View>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}>
          <Animated.View style={{
            marginTop: HEADER_MAX_HEIGHT + 10,
            marginLeft: 10
          }}>
            <Transition shared='event-title'>
              <Text style={{ fontSize: 25, textAlign: 'left', marginLeft:10, marginRight : 10, fontWeight: '500'}}>{item.title}</Text>
            </Transition>
          </Animated.View>
          {/* <Grid style={{ margin:15, padding : 5, backgroundColor : '#efefef', borderRadius : 12 }}>
            <Row style={{ marginTop: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='calendar' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{this.parseDate(item.date)}</Text>
              </View>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='time' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{this.parseTime(item.date)}</Text>
              </View>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='pin' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{item.location}</Text>
              </View>
            </Row>
          </Grid> */}
          <Text style={{fontSize : 15, margin:15}}>{item.description}</Text>
          
          {/* <Grid style={{ padding : 15, backgroundColor : '#efefef'}}>
            <Row style={{ marginTop: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='pulse' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{'250+ People Interested'}</Text>
              </View>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='hand' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{item.enrollees + ' People Coming'}</Text>
              </View>
            </Row>
            <Row style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='paw' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text>{item.available_seats - item.enrollees + ' Seats Avilable'}</Text>
              </View>
            </Row>
          </Grid> */}
          
          <View style ={{flex : 1, backgroundColor : '#efefef', justifyContent : 'center', paddingTop: 10, marginBottom:10}}>
            <FastImage
              style= {{width : 56, height : 56, borderRadius : 12, margin:5, alignSelf : 'center'}}
              source={{
                uri : 'https://imagens.canaltech.com.br/137091.237729-Logos-estilo-Instagram.png',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}/>
            <Text style={{color : 'rgb(31, 31, 92)', fontSize :22, alignSelf : 'center'}}>Event by Dock</Text>
            <Text style={{color : '#a5a5a5', fontSize :15, alignSelf : 'center'}}>Tap to enroll for this event</Text>
            {/* <Button style={{backgroundColor : 'rgb(31, 31, 92)', borderRadius : 15, marginTop:10, justifyContent : 'center', alignSelf : 'center'}}>
              <Text style={{color : '#fff', fontSize : 15}}>{'ENROLL'}</Text>
            </Button> */}
            <Text style={{color : '#a5a5a5', fontSize :10, alignSelf : 'center', marginBottom:10, padding:5}}>Easy In-app Purchase</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

EventDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default EventDetailScreen;