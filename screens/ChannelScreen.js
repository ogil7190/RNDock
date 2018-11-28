import React, { Component } from 'react';
import { ScrollView, Platform, View, Image, StatusBar, TouchableOpacity, RefreshControl, AsyncStorage } from 'react-native';
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
    college_popular_channels : [],
    from_my_interests : [],
    explore : []
  }

  update_user_token = async () => {
    try {
      const str = await AsyncStorage.getItem('data');
      const bundle = JSON.parse(str);
      const data = bundle.data;
      const college = data.college;
      const interests = data.interests;
      const token = bundle.token;
      this.setState({ token, college });
      this.fetch_channels(token, college, ()=>{
        this.fetch_suggestions(token, interests);
      });
    } catch(Exception) {
      console.log(Exception);
    }
  }

  fetch_suggestions = (token, interests) =>{
    this.setState({ isRefreshing: true });
    Realm.getRealm((realm) => {
      let channels = realm.objects('Channel').filtered('followed = "true"');
      this.process_realm_obj(channels, (result)=>{
        let followed_channels = [];
        for(var i=0; i<result.length; i++){
          followed_channels.push(result[i]._id);
        }
        axios.post('https://mycampusdock.com/channels/top', { count : 20, category_list : JSON.stringify(interests), channels_list : JSON.stringify(followed_channels) }, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        }).then(response => {
          if(response.data.error) console.log(response.data.error);
          else{
            let from_my_interests = response.data.data;
            let areas = ['Technology', 'Coding', 'Entertainment', 'Fashion', 'Sports', 'Science', 'Literature', 'Culture', 'Social', 'Art & Craft', 'Business', 'Politics'];
            let others = [];
            for(var i=0; i<areas.length; i++){
              if(interests.includes(areas[i])) continue;
              others.push(areas[i]);
            }
            axios.post('https://mycampusdock.com/channels/top', { count : 20, category_list : JSON.stringify(others), channels_list : JSON.stringify(followed_channels) }, {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
              }
            }).then(response => {
              if(response.data.error) console.log(response.data.error);
              else{
                this.setState({ from_my_interests, explore : response.data.data, isRefreshing : false});
              }
            }).catch( err => {
              console.log('My error', err);
              this.setState({ isRefreshing: false });
            });
          }
        }).catch( err => {
          console.log('My error', err);
          this.setState({ isRefreshing: false });
        });
      });
    });
  }

  populate_channels = () =>{
    Realm.getRealm((realm) => {
      var data = realm.objects('Channel').filtered('priority >= 4');
      this.process_realm_obj(data, (result)=>{
        this.setState({college_popular_channels : result});
      });
    });
  }

  fetch_channels = (token, college, callback) => {
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
          el.requested = ''+el.requested;
        });
        
        var data = response.data.data;
        Realm.getRealm((realm) => {
          realm.write(() => {
            for(var i=0;i<data.length;i++) {
              realm.create('Channel', data[i], true);
            }
            this.populate_channels();
          });
        });
      }
    }).catch( err => {
      console.log(err);
    }).then( () => {
      this.setState({ isRefreshing: false });
      callback();
    });
  }

  render() {
    return(
      <View style={{ flex: 1,backgroundColor : '#fff'}}>
        <StatusBar
          backgroundColor="rgb(31, 31, 92)"
          translucent
          barStyle="light-content"/>
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : 80, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.6, shadowOffset : {width : 1, height : 1}, elevation : 6, paddingBottom : 5}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5,}}>
            <TouchableOpacity style = {{backgroundColor : '#fff', borderRadius : 30, width : 35, height : 35,justifyContent : 'center', alignItems : 'center', marginLeft : 5}}>
              <Icon style={{ color : 'rgb(31, 31, 92)', fontSize:25, padding:5}} name='notifications'/>
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity style = {{backgroundColor : '#fff', borderRadius : 30, width : 35, height : 35,justifyContent : 'center', alignItems : 'center', marginRight : 5}} onPress={()=>this.props.navigation.navigate('SearchScreen', {data : {type : 'channels', placeholder : 'Search channels with name, type etc.'}})}>
              <Icon style={{ color : 'rgb(31, 31, 92)', fontSize:25, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style = {{backgroundColor: 'transparent', marginTop : 10}}
          refreshControl={
            <RefreshControl
              colors={['rgb(31, 31, 92)']}
              refreshing={this.state.isRefreshing}
              onRefresh={()=>this.fetch_channels(this.state.token, this.state.college, ()=>console.log('done'))}
            />
          }>
          
          <CustomList 
            title = "Recommended By College" 
            showTitle = {true}
            automaticTitle = {true}
            style = {{marginTop : 10}}
            isHorizontal = {true}
            data = {this.state.college_popular_channels}
            onRender = {({item})=> <ChannelCard data={item} onPress = {()=> this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item._id, item : item})} />}/>

          <CustomList
            title = "Suggested For You"
            showTitle = {true}
            automaticTitle = {true}
            style = {{marginTop : 10}}
            isHorizontal = {true}
            data = {this.state.from_my_interests}
            onRender = {({item})=> <ChannelCard data={item} onPress = {()=> this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item._id, item : item})} />}/>

          <CustomList
            title = "Explore Out of Box"
            showTitle = {true}
            automaticTitle = {true}
            style = {{marginTop : 10}}
            isHorizontal = {true}
            data = {this.state.explore}
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