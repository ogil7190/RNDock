import React, { Component } from 'react';
import { Text, Animated, ScrollView, AsyncStorage, View, StatusBar,TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { Transition } from 'react-navigation-fluid-transitions';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import Realm from '../realmdb';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 70;

class EventDetailScreen extends Component {

  static navigationOptions = {
    header: null
  };

  state={
    scrollY: new Animated.Value(0),
    active : false,
    remTime : null,
    item : null,
    isRefreshing : false
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

  componentDidMount(){
    if(this.state.remTime == null){
      const item = this.props.navigation.getParam('item', {});
      const regstart= new Date(item.reg_start);
      const regend= new Date(item.reg_end);
      const current = new Date();
      console.log(regstart.getTime(), regend.getTime(), current.getTime());
      if(current.getTime() < regstart.getTime()){
        this.setState(() => {
          return { remTime : regstart.getTime() - current.getTime(),  };
        });
      } else if(current.getTime() < regend.getTime()){
        this.setState(() => {
          return { remTime : 0,  };
        });
      } else {
        this.setState(() => {
          return { remTime : -1,  };
        });
      }
      this.getStatus();
    }
    if(this.state.item == null)
      this.fetch_event();
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  fetch_event = async () =>{
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    if( token === null) return;
    this.setState({ token });
    const { navigation } = this.props;
    const item = navigation.getParam('item', {});

    axios.post('https://mycampusdock.com/events/user/fetch-event-data', { _id : item._id}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      if(!response.data.error) {
        response.data.data.forEach((el)=>{
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          el.date = new Date(el.date);
          el['enrolled'] = '100'; // 100 for not enrolled
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrollees = JSON.stringify(el.enrollees);
          el.media = JSON.stringify(el.media);
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
        });

        Realm.getRealm((realm) => {
          let data = response.data.data;
          if(data.length === 0) return;
          realm.write(() => {
            let i;
            for(i=0;i<data.length;i++) {
              try {
                realm.create('Events', {_id : data[i]._id, title : data[i].title, description : data[i].description, enrollees : data[i].enrollees, reach : data[i].reach, view : data[i].views}, true);
              } catch(e) {
                console.log('Realm', e);
              }
            }
          });
          const event = realm.objects('Events');
          for(var i =0; i<event.length; i++){
            if(event[i]._id == item._id){
              var res = {};
              Object.keys(event[i]).forEach((key)=>{
                res[key] = event[i][key];
              });
              this.setState({item : res});
              break;
            }
          }
        });
      }
    }).catch( err => {
      console.log(err);
    })
      .then( () => {
        this.setState({ isRefreshing: false });
      });
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

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  getStatus = () =>{
    this.timerId = setInterval(()=>{
      this.setState((prevState) => {
        if(prevState.remTime > 0)
          return { remTime : prevState.remTime - 1000 };
      }, ()=> {
        if(this.state.remTime <= 0){
          clearInterval(this.timerId);
          if(this.state.remTime === 0)
            this.setState({active : true});
          else 
            this.setState({active : false});
        }
      });
    }, 1000);
  }

  parseRem = (time) =>{
    var sec = time / 1000;
    if(sec > 1){
      var mins = sec / 60;
      if(mins > 1){
        var hours = mins / 60;
        if(hours > 1){
          var days = hours / 24;
          if(days > 1){
            return Math.floor(days) + ' days ' + Math.floor(hours - Math.floor(days) * 60) + ' hours'; 
          }
          else {
            return Math.floor(hours) + ' hours ' + Math.floor(mins - Math.floor(hours) * 60) + ' mins'; 
          }
        }
        else {
          return Math.floor(mins) + ' mins ' + Math.floor(sec - Math.floor(mins) * 60) + ' sec'; 
        }
      }
      else {
        return Math.floor(sec)  + ' sec';
      }
    }
    else{
      return 'START';
    }
  }
  
  render() {
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
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
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
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
            <FastImage
              style={{ width: '100%', height: '100%'}}
              source={{
                uri : 'https://mycampusdock.com/' + JSON.parse(item.media)[0],
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Animated.View>
          <Animated.View style={{ position: 'absolute', bottom: eventNameOffset, left: 0, right: 0, alignItems: 'center'}}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.title}</Text>
          </Animated.View>
          
          <View
            style={{
              position: 'absolute',
              top: 15,
              left: 5,
            }}>
            <TouchableOpacity onPress = {()=>goBack()} style= {{width : 36, height : 36, marginTop : 15, marginLeft : 5}}>
              <Icon name="arrow-back" style={{ color: '#fff', fontSize: 30}}/>
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: 'absolute',
              top: 15,
              right : 5,
            }}>
            <TouchableOpacity onPress = {()=>console.log('heart')} style= {{width : 36, height : 36, marginTop : 15, marginLeft : 5}}>
              <Icon name = {'heart'} style={{ fontSize: 30, color : '#f55'}}/>
            </TouchableOpacity>
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
              <Text style={{ fontSize: 22, textAlign: 'left', marginLeft:10, marginRight : 10, marginTop : 10, fontWeight: '500'}}>{item.title}</Text>
            </Transition>
          </Animated.View>
          <View style={{ margin:15, padding : 5, backgroundColor : '#efefef', borderRadius : 12 }}>
            <View style={{ marginTop: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='calendar' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{this.parseDate(item.date)}</Text>
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='time' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{this.parseTime(item.date)}</Text>
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='pin' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{item.location}</Text>
              </View>
            </View>
          </View>
          <Text style={{fontSize : 16, margin:15}}>{item.description}</Text>
          <View style={{ padding : 15, backgroundColor : '#efefef'}}>
            <View style={{ marginTop: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='pulse' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{item.views + ' People Interested'}</Text>
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='hand' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{item.enrollees + ' People Coming'}</Text>
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='paw' style={{ marginLeft: 10, marginRight: 10, fontSize:25 }}/>
                <Text style={{fontSize :16}}>{item.available_seats - item.enrollees + ' Seats Avilable'}</Text>
              </View>
            </View>
          </View>
          
          <View style ={{flex : 1, backgroundColor : '#efefef', justifyContent : 'center', paddingTop: 10, marginBottom:10}}>
            <FastImage
              style= {{width : 56, height : 56, borderRadius : 12, margin:5, alignSelf : 'center'}}
              source={{
                uri : 'https://mycampusdock.com/' + (''+item.channel).trim().split(' ').join('_') +'/logo.webp',
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}/>
            <Text style={{color : 'rgb(31, 31, 92)', fontSize :22, alignSelf : 'center'}}>{'Event by '+ (''+item.channel).toUpperCase()}</Text>
            <Text style={{color : '#a5a5a5', fontSize :15, alignSelf : 'center'}}>{this.state.remTime === 0 ? 'Tap to enroll for this event' : this.state.remTime > 0 ? 'Registration will start in ' + this.parseRem(this.state.remTime) : 'Event Registration are Closed!'}</Text>
            <TouchableOpacity style={{backgroundColor : this.state.active ? 'rgb(31, 31, 92)' : '#c5c5c5', borderRadius : 15, marginTop:10, justifyContent : 'center', alignSelf : 'center'}} onPress = {()=> this.state.active ? this.props.navigation.navigate('CheckOutEvent', {item}) : console.log('Ohh Fuck!')}>
              <Text style={{color : '#fff', fontSize :18, margin : 5, padding : 5}}>{this.state.active ? 'ENROLL' : this.state.remTime > 0 ? 'Coming Soon' : 'CLOSED'}</Text>
            </TouchableOpacity>
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