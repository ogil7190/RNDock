import React, { Component } from 'react';
import {Text, View, StatusBar, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

class PreviewStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current : 0
    };
  }

  componentWillUnmount(){
    StatusBar.setHidden(false);
  }

  componentDidMount(){
    StatusBar.setHidden(true);
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

  getPollType = (item) =>{
    const len = item.message.split(' ').length / 2;
    const type = Math.round(Math.random()) ? 'vote' : 'count';
    item.options = ['I AM VOTE A', 'WE ARE VOTE B', 'ALL OF US ARE C'];
    return (
      <LinearGradient colors={['rgb(224, 62, 99)', 'rgb(224, 62, 99)', 'rgb(240, 120, 57)']}  style={{backgroundColor : 'red', flex : 1, marginTop : 20, borderTopLeftRadius : 15, borderTopRightRadius : 15}}>
        <Text style={{fontSize : 40 - 1 * len, padding : 5, margin : 10, color : '#fff', textAlign : 'center',}}>{item.message}</Text>
        <View style={{marginLeft : 20, marginRight : 20, justifyContent : 'center', flex : 1, alignItems : 'center'}}>
          {this.getOptions(type, item.options)}
        </View>
      </LinearGradient>
    );
  }

  getPostImgType = (item) =>{
    item.message = 'I was going to fuck this shit but then it reminds me of getting high, I am above ninth cloud!';
    return (
      <View style={{flex : 1}}>
        <FastImage
          style={{flex : 1, borderRadius : 5}}
          source={{
            uri : 'https://mycampusdock.com/' + item.media[0],
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{backgroundColor : 'rgba(1, 1, 1, 0.5)', borderRadius : 12, margin : 10, position : 'absolute', bottom : 25, flexDirection : 'row'}}>
          <Text style={{fontSize : 18, padding : 5, color : '#fff', textAlign : 'center', flex : 1}}>{item.message}</Text>
        </View>
      </View>
    );
  }

  getOptions = (type, options) =>{
    if(type === 'vote'){
      return (
        <View style={{backgroundColor : '#efefef', shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5, borderRadius : 12}} >
          {
            options.map((val, index) =>
              <TouchableOpacity style={{flexDirection : 'row', backgroundColor : '#fff', borderRadius : 8, marginLeft : 10, marginRight : 10, margin : 8, }}  key={index}>
                <Text style={{fontSize : 25, padding : 8}}>{'• ' + options[index]}</Text>
              </TouchableOpacity>
            )
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

  render() {
    const { navigation } = this.props;
    const {goBack} = this.props.navigation;
    const data = navigation.getParam('item', []);
    const size = data.length;
    const item = size > 1 ? data[this.state.current] : data[this.state.current].item;
    return(
      <View style={{flex : 1, backgroundColor : '#000'}}>
        <View style ={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
          <Text style={{fontSize : 20, margin : 10, color : '#fff', fontWeight : '500'}}>{ (this.state.current + 1) + '/' + size}</Text>
          <View style={{flex : 1}} />
          <TouchableOpacity style={{margin : 10, padding : 5}} onPress={ () => goBack()}><Icon name='close' style={{fontSize : 45, color : '#fff'}}/></TouchableOpacity>
        </View>
        {this.renderWithTypes(item)}
      </View>
    );
  }
}

PreviewStory.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default PreviewStory;