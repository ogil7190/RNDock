import React, { Component } from 'react';
import { ScrollView, Text, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlatCardChannel from './components/FlatCardChannel';
import axios from 'axios';
import Realm from '../realmdb';
import Icon from 'react-native-ionicons';
import FlatCard from './components/FlatCard';
import FlatCardHorizontal from './components/FlatCardHorizontal';
import FirebaseModule from './FirebaseModule';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.fetch_event_data = this.fetch_event_data.bind(this);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
  }

  async componentDidMount() {
    await this.update_user_token();
    let flag = await AsyncStorage.getItem('subscribed');
    if(flag){
      await this.handleSubscription();
    }
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  state = {
    isRefreshing: false,
    event_list: null,
  }

  handleSubscription = async () =>{
    FirebaseModule.subscribeTag('ogil');
    FirebaseModule.subscribeTag('menime');
    FirebaseModule.subscribeTags(['Fuck', 'ogil7190']);
    await AsyncStorage.setItem({ subscribed : 'true'});
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      if( token === null) return;
      this.setState({ token });
      await this.update_event_list();
    } catch(Exception) {
      console.log(Exception);
    }
  }

  unsaveUser = async ()=>{
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  fetch_event_data = (token, last_updated, callback) => {
    axios.post('https://mycampusdock.com/events/user/get-event-list', { last_updated }, {
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
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrollees = JSON.stringify(el.enrollees);
          el.media = JSON.stringify(el.media);
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
        });
        callback(response.data.data);
      }
    })
      .catch( err => {
        callback([]);
        console.log(err);
      })
      .then( () => {
        this.setState({ isRefreshing: false });
      });
  }


  update_event_list = async () => {
    let { token } = this.state;
    this.setState({ isRefreshing: true });
    const process_realm_obj = this.process_realm_obj;
    Realm.getRealm((realm) => {
      let EventsOld = realm.objects('Events').sorted('timestamp');
      let timestamp;
      try {
        timestamp = EventsOld[EventsOld.length - 1].timestamp;
      } catch(e) {
        timestamp = 'NONE';
      }
      this.fetch_event_data(token, timestamp, (data) => {
        if(data.length === 0) return;
        realm.write(() => {
          let i;
          for(i=0;i<data.length;i++) {
            try {
              realm.create('Events', data[i], true);
            } catch(e) {
              console.log(e);
            }
          }
        }); 
      });

      let Events = realm.objects('Events').sorted('timestamp');
      process_realm_obj(Events, (result) => {
        console.log('Data', result);
        this.setState({ event_list: result.reverse() });
      });  
    });
  }

  render() {
    const event_list = this.state.event_list === null ? [] : this.state.event_list;
    return(
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="rgb(73, 166, 232)"
          translucent
          barStyle="light-content"/>
        <View style = {{ backgroundColor : 'rgb(73, 166, 232)', height : 75, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.8, shadowOffset : {width : 2, height : 5}, elevation : 6}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5, shadowOpacity : 0.3,}}>
            <TouchableOpacity onPress = {()=>console.log('Menu works here!')}>
              <Icon style={{ color : '#fff', fontSize:35, padding : 5}} name='menu'/> 
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity onPress = {()=>console.log('Search works here!')}>
              <Icon style={{ color : '#fff', fontSize:35, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style = {{backgroundColor: '#fff'}}
          refreshControl={
            <RefreshControl
              colors={['rgb(73, 166, 232)']}
              refreshing={this.state.isRefreshing}
              onRefresh={this.update_event_list.bind(this)}
            />
          }>
          <Text style={{fontSize : 18, marginLeft :22, marginTop : 5, marginBottom:5}}>
            Channel Updates
            <Text  style={{color : 'red', fontSize : 25}}> • </Text>
          </Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={[{ image : 'https://mycampusdock.com/channels/dock.webp', title : 'Dock Blog Launched', channel : 'ogil7190', data : 'Something', url : 'Something'},
              { image : 'https://mycampusdock.com/channels/dock-manager.webp', title : 'Dock Payments Portal Launched', channel : 'menime', data : 'Something', url : 'Something'}]}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <FlatCardChannel image = {item.image} title = {item.title} channel = {item.channel} data = {item.data} url = {item.url} />}
          />
          <Text style={{fontSize : 18, marginLeft : 22, marginTop : 5, marginBottom : 5}}>
            All about Today
            <Text  style={{color : 'red', fontSize : 25}}> • </Text>
          </Text>
          
          <FlatList
            keyExtractor={(item) => item._id}
            data={event_list}
            horizontal = {true}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <FlatCardHorizontal image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title}channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>

          <Text style={{fontSize : 18, marginLeft : 22, marginTop : 5, marginBottom : 5}}>
            Upcoming Events
            <Text  style={{color : 'red', fontSize : 25}}> • </Text>
          </Text>
          
          <FlatList
            keyExtractor={(item) => item._id}
            data={event_list}
            style = {{marginLeft : 20, marginRight : 20}}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <FlatCard image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title} channel = {item.channel} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(HomeScreen);