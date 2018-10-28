import React, { Component } from 'react';
import {Text, View, StatusBar, TouchableOpacity, AsyncStorage, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import Realm from '../realmdb';

class PreviewStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current : 0,
      poll : null,
      fetched : false,
      updated : false
    };
  }

  componentWillUnmount(){
    StatusBar.setHidden(false);
  }

  fetching = false;

  componentDidMount(){
    StatusBar.setHidden(true);
    const data = this.props.navigation.getParam('item', []);
    const updates_only = this.props.navigation.getParam('updates_only', null);
    if(updates_only){
      for(var i=0; i< data.length; i++){
        if(data[i].watched !== 'true'){
          this.setState({current : i});
          break;
        }
      }
    }
  }

  static navigationOptions = {
    header: null,
  };

  getPostType = (item) =>{
    const len = item.message.split(' ').length / 2;
    return (
      <LinearGradient colors={['rgb(224, 62, 99)', 'rgb(224, 62, 99)', 'rgb(240, 120, 57)']}  style={{backgroundColor : 'red', flex : 1, justifyContent : 'center', alignItems : 'center', borderTopLeftRadius : 15, borderTopRightRadius : 15}}>
        <Text style={{fontSize : 40 - 1 * len, padding : 5, margin : 10, color : '#fff', textAlign : 'center',}}>{item.message}</Text>
      </LinearGradient>
    );
  }

  setPoll = (_id, fetched) =>{
    Realm.getRealm((realm) => {
      let poll = realm.objects('Activity').filtered('_id = "' + _id + '"');
      this.process_realm_obj(poll, (result) => {
        this.setState({poll : result[0], fetched}); /* TRY TO REMOVE THIS SET STATE IN RENDER */
      });
    });
  }

  getPollType = (item) =>{
    if(this.state.poll === null){
      this.setPoll(item._id, false);
    }
    const len = item.message.split(' ').length / 2;
    return (
      this.state.poll  ? <LinearGradient colors={['rgb(224, 62, 99)', 'rgb(224, 62, 99)', 'rgb(240, 120, 57)']}  style={{backgroundColor : 'red', flex : 1, paddingTop : 10, borderTopLeftRadius : 15, borderTopRightRadius : 15}}>
        <Text style={{fontSize : 40 - 1 * len, padding : 5, margin : 10, color : '#fff', textAlign : 'center',}}>{item.message}</Text>
        <View style={{marginLeft : 20, marginRight : 20, justifyContent : 'center', flex : 1, alignItems : 'center'}}>
          {
            this.state.poll.answered === 'false' ? this.getOptions() : this.drawStats()
          }
        </View>
      </LinearGradient> : <View/>
    );
  }

  markPoll = async (option, _id) =>{
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    const {goBack} = this.props.navigation;
    if( token === null) return;
    axios.post('https://mycampusdock.com/channels/user/answer-poll', {_id, option}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    }).then(async (response) => {
      if(!response.data.error){
        Realm.getRealm((realm) => {
          realm.write(() => {
            realm.create('Activity', {_id, answered : option, options : JSON.stringify(response.data.data.options)}, true);
          });
        });
        goBack();
      }
    });
  }

  process_realm_obj = (RealmObject, callback) => {
    var result = Object.keys(RealmObject).map(function(key) {
      return {...RealmObject[key]};
    });
    callback(result);
  }

  fetchPoll = async (_id) =>{
    if(!this.fetching){
      this.fetching = true;
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      if( token === null) return;
      axios.post('https://mycampusdock.com/channels/user/fetch-poll-stats', {_id}, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      }).then(async (response) => {
        if(!response.data.error){
          Realm.getRealm((realm) => {
            realm.write(() => {
              realm.create('Activity', {_id, options : JSON.stringify(response.data.data.options)}, true);
            });
            this.setPoll(_id, true);
          });
        }
      });
    }
  }

  drawStats = () =>{
    if(this.state.poll){
      let type = this.state.poll.poll_type;
      let options = JSON.parse(this.state.poll.options);
      let id = this.state.poll._id;
      if(type === 'vote'){
        let total = 0;
        Object.entries(options).map((val)=> total += val[1].length);
        return (
          <View style={{backgroundColor : '#efefef', shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5, borderRadius : 12, flexDirection : 'row',}} >
            {
              Object.entries(options).map((val, index) =>{
                var len = val[1].length;
                const size = val[0].length;
                var ratio = Math.floor(len / total * 10);
                var nratio = Math.floor(  (1 - (len / total)) * 10);
                if(!this.state.fetched)
                  this.fetchPoll(id);
                return(
                  <View style={{backgroundColor : '#fff', borderRadius : 8, marginLeft : 8, marginRight : 8, margin : 8, padding : 8}}  key={index}>
                    <View style={{width : 60, height : 60, justifyContent : 'center', alignItems : 'center'}}>
                      <Text style={{fontSize : 22 - 0.4 * size, textAlign : 'center'}} numberOfLines={3} ellipsizeMode ='tail' textBreakStrategy='balanced'>{val[0]}</Text>
                    </View>
                    <View style={{height : 150, borderTopColor : '#a5a5a5', borderTopWidth : 1, paddingTop : 5}}>
                      <View style={{backgroundColor : '#fff', flex : nratio}}/>
                      <LinearGradient colors={['rgb(91, 203, 15)', 'rgb(89, 200, 170)']}  style={{flex : ratio}}>
                        <Text style={{color : '#fff', textAlign : 'center', fontSize : 15}}>{ Math.floor((len / total) * 100) + '%'}</Text>
                      </LinearGradient>
                    </View>
                  </View>
                );
              })
            }
          </View>
        );
      }
    }
  }

  getOptions = () =>{
    if(this.state.poll){
      let type = this.state.poll.poll_type;
      let options = JSON.parse(this.state.poll.options);
      let id = this.state.poll._id;
      if(type === 'vote'){
        return (
          <View style={{backgroundColor : '#efefef', shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5, borderRadius : 12}} >
            {
              options.map((val, index) =>{
                const len = val.split(' ').length;
                return(<TouchableOpacity style={{flexDirection : 'row', backgroundColor : '#fff', borderRadius : 8, marginLeft : 10, marginRight : 10, margin : 8, }}  key={index} onPress={()=>this.markPoll(val, id)}>
                  <Text style={{fontSize : 25 - 0.8 * len, padding : 8}}>{String.fromCharCode(65 + index) + ') ' + val}</Text>
                </TouchableOpacity>);
              })
            }
          </View>
        );
      }

      if(type === 'count'){
        return (
          <View style={{flexDirection : 'row'}}>
            <TouchableOpacity style={{backgroundColor : '#efefef',margin : 15, borderRadius : 60, width : 120, height : 120, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5, justifyContent : 'center', alignItems : 'center'}}>
              <Icon name='heart' style={{fontSize : 70}} />
              <Text style={{fontSize : 20}}>Beauty</Text>
            </TouchableOpacity>
            <View style={{flex : 1}} />
            <TouchableOpacity style={{backgroundColor : '#efefef',margin : 15, borderRadius : 60, width : 120, height : 120, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5, justifyContent : 'center', alignItems : 'center'}}>
              <Icon name='paw' style={{fontSize : 70}} />
              <Text style={{fontSize : 20}}>Cute</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }

  getPostImgType = (item) =>{
    return (
      <View style={{flex : 1}}>
        <FastImage
          style={{flex : 1, borderRadius : 5}}
          source={{
            uri : 'https://mycampusdock.com/' + item.media,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{backgroundColor : 'rgba(1, 1, 1, 0.5)', borderRadius : 12, margin : 10, position : 'absolute', bottom : 25, flexDirection : 'row'}}>
          <Text style={{fontSize : 18, padding : 5, color : '#fff', textAlign : 'center', flex : 1}}>{item.message}</Text>
        </View>
      </View>
    );
  }

  renderWithTypes = (item) =>{
    switch(item.type){
    case 'post' :
      return this.getPostType(item);
    case 'post-image':
      return this.getPostImgType(item);
    case 'poll' :
      return this.getPollType(item);
    }
  }

  viewStyle() {
    return {
      flex: 1,
      backgroundColor: '#rgb(100, 100, 100)',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  update = (obj) =>{
    Realm.getRealm((realm) => {
      realm.write(() => {
        realm.create('Activity', {_id : obj._id, watched : 'true'}, true);
      });
    });
  }

  render() {
    const { navigation } = this.props;
    const {goBack} = this.props.navigation;
    const data = navigation.getParam('item', []);
    const open = navigation.getParam('open', true);
    const size = data.length;
    const dim = Dimensions.get('window');
    this.update(open ? data[this.state.current].item : data[this.state.current]);
    return(
      <Swiper
        loop={false}
        onIndexChanged = {(index)=>this.setState({current : index, updated : false})}
        showsButtons = {true}
        index = {this.state.current}
        prevButton = { <Text style={{width : dim.width / 2 - 80, height : dim.height - 80, color : 'transparent', marginBottom : -80}}>‹</Text> }
        nextButton = { <Text style={{width : dim.width / 2 - 80, height : dim.height - 80, color : 'transparent', marginBottom : -80}}>›</Text>}
        showsPagination={false}>
        {
          Object.entries(data).map((obj, index)=>{
            const item = open ? obj[1].item : obj[1];
            return(<View style={{flex : 1, backgroundColor : '#000'}} key={index}>
              <View style ={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontSize : 20, margin : 10, color : '#fff', fontWeight : '500'}}>{ (this.state.current + 1) + '/' + size}</Text>
                <View style={{flex : 1}} />
                <TouchableOpacity style={{margin : 10, padding : 5}} onPress={ () => goBack()}><Icon name='close' style={{fontSize : 45, color : '#fff'}}/></TouchableOpacity>
              </View>
              {this.renderWithTypes(item)}
            </View>);
          })
        }
      </Swiper>
    );
  }
}

PreviewStory.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default PreviewStory;