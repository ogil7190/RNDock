import React, { Component } from 'react';
import { Text, Container, Content, Header, Icon } from 'native-base';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, View, StatusBar, RefreshControl, AsyncStorage, FlatList } from 'react-native';
import FlatCardChannel from './components/FlatCardChannel';
import { DeviceEventEmitter } from 'react-native';
import axios from 'axios';
import Realm from 'realm';
import FlatCard from './components/FlatCard';
import FirebaseModule from './FirebaseModule';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.fetch_event_data = this.fetch_event_data.bind(this);
    this.update_realm = this.update_realm.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
    const update_user_token = this.update_user_token;
    const update_realm = this.update_realm;
    
    this.Events = {
      name: 'Events',
      primaryKey: '_id',
      properties: {
        audience: 'string',
        available_seats: 'string',
        category: 'string',
        college: 'string',
        contact_details: 'string',
        date: 'date',
        description: 'string',
        email: 'string',
        enrollees: 'string',
        faq: 'string',
        location: 'string',
        media: 'string',
        name: 'string',
        price: 'string',
        reach: 'string',
        reg_end: 'date',
        reg_start: 'date',
        tags: 'string',
        timestamp: 'date',
        title: 'string',
        views: 'string',
        _id:  'string',
      }
    };
    
    Realm.open({schema: [this.Events], deleteRealmIfMigrationNeeded: true })
      .then(realm => {
        update_realm(realm);
        update_user_token();
        let Events = realm.objects('Events').sorted('timestamp');
        var result = Object.keys(Events).map(function(key) {
          return { ...Events[key] };
        });
        this.setState({ event_list: result.reverse() });
      });
  }

  state = {
    isRefreshing: false,
    event_list: null
  }

  update_realm = (realm) => {
    this.realm = realm;
  }

  handleSubscription = () =>{
    if(Platform.OS == 'android'){
      FirebaseModule.subscribeTag('ogil');
      FirebaseModule.subscribeTag('menime');
      FirebaseModule.subscribeTags(['Fuck', 'ogil7190']);
    }
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      if( token === null) return;
      this.setState({ token });
      this.update_event_list();
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
    } )
      .catch( err => {
        callback([]);
        console.log(err);
      })
      .then( () => {
        this.setState({ isRefreshing: false });
      });
  }

  update_event_list = () => {
    let { token } = this.state;
    this.setState({ isRefreshing: true });
    const realm = this.realm;
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
            realm.create('Events', data[i]);
          } catch(e) {
            // console.log(e);
          }
        }
      });
      let Events = realm.objects('Events').sorted('timestamp');
      var result = Object.keys(Events).map(function(key) {
        return { ...Events[key] };
      });
      this.setState({ event_list: result.reverse() });
    }); 
  }

  UNSAFE_componentWillMount = () => {
    DeviceEventEmitter.addListener('FCM_MSSG', function(e) {
      console.log(JSON.stringify(e));
    });
  }

  componentDidMount(){
    AsyncStorage.getItem('subscribed', (val)=>{
      if(val === null){
        this.handleSubscription();
      }
    });
  }

  render() {
    const event_list = this.state.event_list === null ? [] : this.state.event_list;
    return(
      <Container>
        <Header style = {{ backgroundColor : 'rgb(73, 166, 232)', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20}}>
          <StatusBar
            backgroundColor="rgb(73, 166, 232)"
            translucent
            barStyle="light-content"/>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5}}>
            <Icon style={{ color : '#fff', fontSize:30, marginLeft : 5}} name='menu'/> 
            <Text style ={{ color : '#fff', fontSize : 22, paddingLeft : 10,  textAlign: 'center', flex : 1}} onPress={this.unsaveUser}>
              {'Dock'} 
            </Text>
            <Text style={{paddingRight : 15}}>
              <Icon style={{ color : '#fff', fontSize:30}} name='search' /> 
            </Text>
            <Icon style={{ color : '#fff', fontSize:30}} name='bookmark' />
          </View>
        </Header>
        <Content
          style = {{backgroundColor: '#fff'}}
          refreshControl={
            <RefreshControl
              colors={['rgb(73, 166, 232)']}
              refreshing={this.state.isRefreshing}
              onRefresh={this.update_event_list.bind(this)}
            />
          }>
          <Text style={{fontSize : 15, marginLeft : 12, marginTop : 5}}>
            Channel Updates
            <Text  style={{color : 'red', fontSize : 20}}> • </Text>
          </Text>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={[{ image : 'https://imagens.canaltech.com.br/137091.237729-Logos-estilo-Instagram.png', title : 'Facebook Developer Meet', channel : 'Facebook', data : 'Something', url : 'Something'},
              { image : 'https://static1.squarespace.com/static/52bcb171e4b0207b1fe5f639/58627b46bebafb6533b0da67/5873f30315d5db147f3bd03a/1483993868090/Website+Background.png?format=2500w', title : 'MKBHD Pixel 3 Unboxing 2018', channel : 'MKBHD', data : 'Something', url : 'Something'},
              { image : 'https://1.bp.blogspot.com/-AOh_vBqtgQE/Wx-uUmRbeAI/AAAAAAAAxDY/s9eoWuunEnUP3Jo92Be4xOqoVm7Mcr9EwCLcBGAs/s728-e100/android-adb-hack.png', title : 'Everything about Android Pie', channel : 'Google Android', data : 'Something', url : 'Something'}]}
            horizontal = {true}
            style = {{marginLeft : 15}}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <FlatCardChannel image = {item.image} title = {item.title} channel = {item.channel} data = {item.data} url = {item.url} />}
          />

          <Text style={{fontSize : 15, marginLeft : 12, marginTop : 5}}>
            Upcoming Events
            <Text  style={{color : 'red', fontSize : 20}}> • </Text>
          </Text>
          <FlatList
            keyExtractor={(item) => item._id}
            data={event_list}
            style = {{marginLeft : 15, marginRight : 15}}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => <FlatCard image = {'https://mycampusdock.com/' + JSON.parse(item.media)[0]} title = {item.title} channel = {'OGIL'} data = {item} onPress = {()=> this.props.navigation.navigate('EventDetailScreen', {item})} />}/>
        </Content>
      </Container>
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