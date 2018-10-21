import React, { Component } from 'react';
import { ScrollView, Text, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Realm from '../realmdb';
import Icon from 'react-native-ionicons';
import ChannelCard from './components/ChannelCard';
import CustomList from './components/CustomList';

class ChannelScreen extends Component {
  constructor(props) {
    super(props);
    this.process_realm_obj = this.process_realm_obj.bind(this);
    this.update_user_token = this.update_user_token.bind(this);
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount() {
    await this.update_user_token();
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
    college_popular_channels : []
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const college = data.data.college;
      const token = data.token;
      if( token === null) return;
      this.setState({ token, college });
      this.populate_channels(college);
      await this.fetch_channels(token, college);
    } catch(Exception) {
      console.log(Exception);
    }
  }

  populate_channels = (college) =>{
    Realm.getRealm((realm) => {
      var data = realm.objects('Channel').filtered('creator = "'+ college +'" AND priority >= 4');
      this.process_realm_obj(data, (result)=>{
        this.setState({college_popular_channels : result});
      });
    });
  }

  fetch_channels = (token, college) => {
    this.setState({ isRefreshing: true });
    axios.post('https://mycampusdock.com/channels/user/fetch-college-channels', { college }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then( response => {
      if(!response.data.error){
        response.data.data.forEach((el)=>{
          el.media = JSON.stringify(el.media);
          el.followers = ''+el.followers;
          el.followed = ''+el.followed;
        });
        
        var data = response.data.data;
        Realm.getRealm((realm) => {
          realm.write(() => {
            for(var i=0;i<data.length;i++) {
              realm.create('Channel', data[i], true);
            }
            this.populate_channels(college);
          });
        });
      }
    }).catch( err => {
      console.log(err);
    }).then( () => {
      this.setState({ isRefreshing: false });
    });
  }

  render() {
    return(
      <View style={{ flex: 1,backgroundColor : '#fff'}}>
        <StatusBar
          backgroundColor="rgb(31, 31, 92)"
          translucent
          barStyle="light-content"/>
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : 75, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.6, shadowOffset : {width : 1, height : 1}, elevation : 6}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5,}}>
            <TouchableOpacity onPress = {()=>this.props.navigation.openDrawer()}>
              <Icon style={{ color : '#fff', fontSize:35, padding : 5}} name='menu'/> 
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity onPress = {()=>console.log('Search works here!')}>
              <Icon style={{ color : '#fff', fontSize:35, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style = {{backgroundColor: 'transparent', marginTop : 10}}
          refreshControl={
            <RefreshControl
              colors={['rgb(31, 31, 92)']}
              refreshing={this.state.isRefreshing}
              onRefresh={this.fetch_channels}
            />
          }>
          
          <CustomList 
            title = "Popular Across College" 
            showTitle = {true}
            style = {{marginTop : 10}}
            isHorizontal = {true}
            data = {this.state.college_popular_channels}
            onRender = {({item})=> <ChannelCard data={item} onPress = {()=> this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item._id, item : item})} />}/>

        </ScrollView>
      </View>
    );
  }
}

ChannelScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(ChannelScreen);