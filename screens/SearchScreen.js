import React, { Component } from 'react';
import {View, TextInput, Text, AsyncStorage, TouchableOpacity, Platform, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import axios from 'axios';
import CustomList from './components/CustomList';
import Tile from './components/Tile';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response : {data : []},
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    if( token === null) return;
    this.setState({ token });
  }

  search = (type) =>{
    let address = null;
    switch(type){
    case 'home' : address = 'events/search';break;
    case 'channels' : address = 'channels/search';break;
    case 'profile' : address = 'users/search';break;
    }
    let query = this.state.query;
    let url = 'https://mycampusdock.com/' + address;
    axios.post(url, { query}, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.token
      }
    }).then( response => {
      if(type === 'home'){
        response.data.data.forEach((el)=>{
          el.audience = JSON.stringify(el.audience);
          el.timestamp = new Date(el.timestamp);
          let ts = Date.parse(''+el.date);
          el.date = new Date(el.date);
          el.ms = ts;
          el.reg_end = new Date(el.reg_end);
          el.reg_start = new Date(el.reg_start);
          el.enrolled = JSON.stringify(el.enrolled);
          el.enrollees = JSON.stringify(el.enrollees);
          el.media = JSON.stringify(el.media);
          el.contact_details = JSON.stringify(el.contact_details);
          el.reach = JSON.stringify(el.reach);
          el.views = JSON.stringify(el.views);
        });
        this.setState({response : response.data});
      }
      else if(type === 'channels'){
        response.data.data.forEach((el)=>{
          el.media = JSON.stringify(el.media);
          el.followers = ''+el.followers;
          el.followed = ''+el.followed;
          el.requested = ''+el.requested;
        });
        this.setState({response : response.data});
      }
      else if(type === 'profile'){
        response.data.data.forEach((el)=>{
          el.media = JSON.stringify(el.media);
        });
        this.setState({response : response.data});
      }
    }).catch((e)=>console.log(e));
  }

  gotoTile = (type, item) =>{
    if(type === 'home') return this.props.navigation.navigate('EventDetailScreen', {item});
    if(type === 'channels') return this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item._id, item : item});
    if(type === 'profile') return this.props.navigation.navigate('UserPreview', {data : item});
  }

  render() {
    const data = this.props.navigation.getParam('data', {});
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>

        <View style = {{ flexDirection : 'row', backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, justifyContent : 'center', alignItems : 'center'}}>
          <TouchableOpacity onPress = {()=>goBack()} style= {{padding : 5, marginLeft : 5, marginRight : 5}}>
            <Icon name="arrow-back" style={{ fontSize: 30}}/>
          </TouchableOpacity>

          <TextInput autoFocus = {true} placeholder = {'Seach Here'} style={{flex : 1, borderRadius : 8, borderWidth : 0.5, borderColor : '#c5c5c5', fontSize : 15, paddingTop : 7, paddingBottom : 7, paddingLeft : 5,}} onChangeText = {(query)=>this.setState({query})}/>
  
          <TouchableOpacity onPress = {()=>this.search(data.type)} style= {{padding : 5, marginRight : 5, marginLeft : 5, backgroundColor : 'rgb(31, 31, 92)', borderRadius : 25, width : 40, height : 40, justifyContent : 'center', alignItems : 'center'}}>
            <Icon name="search" style={{ fontSize: 25, color : '#fff'}}/>
          </TouchableOpacity>
        </View>
        {
          this.state.response.data.length > 0 
            ? 
            <CustomList
              title = 'Something'
              data={this.state.response.data}
              showTitle = {false}
              isHorizontal = {false}
              style={{marginTop : 10,}}
              onRender={({item}) => <Tile data={item} type = {data.type} onClick = {()=> this.gotoTile(data.type, item)}/>} />
            :
            <Text style={{fontSize : 15, color : '#555555', margin : 10}}>{'Tip : ' + data.placeholder}</Text>
        }
      </View>
    );
  }
}

SearchScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SearchScreen;