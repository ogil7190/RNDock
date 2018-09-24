import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import FastImage from 'react-native-fast-image';

class Activity extends Component {
  constructor(props){
    super(props);
    this.state = {
      email : null,
      loading : false
    };
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

  getPostType = (item) =>{
    return(
      <View style={{backgroundColor : '#fff', borderRadius : 3, marginLeft : 10, marginRight : 10, marginTop : 4, marginBottom : 4, shadowOpacity : 0.15, shadowOffset : {width : 1, height : 1}}}>
        <Text style={{fontSize : 18, padding : 5}}>{item.message}</Text>
        <View style={{flexDirection : 'row'}}>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'left'}}>{item.name}</Text>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'right'}}>{this.parseDate(item.timestamp) + ' '+this.parseTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  }

  isPollValid = (item) =>{
    for(let key in item.options){
      if(item.options[key].includes(this.props.email)){
        if(this.state.loading)
          this.setState({loading : false});
        return false;
      }
    }
    return true;
  }

  handlePress = (key) =>{
    this.setState({loading : true});
    this.props.onPress({key});
  }

  calPer = (key) =>{
    let total = 0;
    let mine = 0;
    for(let k in this.props.data.options){
      total += this.props.data.options[k].length;
      if(k === key){
        mine = this.props.data.options[k].length;
      }
    }
    return mine / total;
  }

  getOption = (key, index) => {
    let valid = this.isPollValid(this.props.data);
    if(valid){
      return(
        <TouchableOpacity style={{borderWidth : 1, borderColor : '#cfcfcf', borderRadius : 3, padding : 5, margin : 5}} key={index} onPress = { ()=> this.handlePress(key)}>
          <View style={{flexDirection : 'row', flex : 1, justifyContent : 'flex-start', alignContent : 'center'}}>
            <Text style={{fontSize : 18, flex : 1}}>{key}</Text>
            <Icon name = 'heart'  style={{color : '#cfcfcf'}}/>
          </View>
        </TouchableOpacity>
      );
    } else {
      let per = this.calPer(key);
      let p = ('' + Math.fround(per * 100 )).substring(0, 4);
      return(
        <View style={{borderWidth : 1, borderColor : '#cfcfcf', borderRadius : 3, padding : 5, margin : 5}} key={index}>
          <View style={{flexDirection : 'row'}}>
            <Text style={{fontSize: 18, padding : 8, flex : 1, textAlign : 'left'}}>{key}</Text>
            <Text style={{fontSize: 15,  borderRadius : 50, color : '#fff', backgroundColor : 'rgb(31, 31, 92)',  padding : 5, paddingLeft : per * 20, textAlign : 'right'}}>{p + '%'}</Text>
          </View>
        </View>
      );
    }
  }

  makePoll = (item) =>{
    let valid = this.isPollValid(item);
    if(valid){
      return (<Text style={{fontSize : 18, padding : 5}}>{item.message}</Text>);
    } else {
      return (<Text style={{fontSize : 18, padding : 5}}>{item.message  + '  '}<Icon name='checkmark' style={{fontSize : 25}} /></Text> );
    }
  }

  getPollType = (item) =>{
    return(
      <View style={{backgroundColor : '#fff', borderRadius : 3,marginLeft : 10, marginRight : 10, marginTop : 4, marginBottom : 4, shadowOpacity : 0.15, shadowOffset : {width : 1, height : 1}}}>
        <View style={{flexDirection : 'row'}}>
          {this.makePoll(item)}
          <ActivityIndicator size="small" color="rgb(31, 31, 92)" animating={this.state.loading}/>
        </View>
        <View>
          {
            Object.keys(item.options).map((key, index)=>{
              return(
                this.getOption(key, index)
              );
            })
          }
        </View>
        <View style={{flexDirection : 'row'}}>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'left'}}>{item.name}</Text>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'right'}}>{this.parseDate(item.timestamp) + ' '+this.parseTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  }

  getPostImgType = (item) =>{
    return(
      <View style={{backgroundColor : '#fff', borderRadius : 3, marginLeft : 10, marginRight : 10, marginTop : 4, marginBottom : 4, shadowOpacity : 0.15, shadowOffset : {width : 1, height : 1}}}>
        <Text style={{fontSize : 18, padding : 5}}>{item.message}</Text>
        <FastImage
          style={{height : 250, borderRadius : 10, margin : 8}}
          source={{
            uri : 'https://mycampusdock.com/' + item.media[0],
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{flexDirection : 'row'}}>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'left'}}>{item.name}</Text>
          <Text style={{fontSize: 15, color : '#a5a5a5', padding : 8, flex : 1, textAlign : 'right'}}>{this.parseDate(item.timestamp) + ' '+this.parseTime(item.timestamp)}</Text>
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

  render() {    
    const item = this.props.data;
    return (
      <View>
        {this.renderWithTypes(item)}
      </View>
    );
  }
}

Activity.propTypes = {
  data : PropTypes.object.isRequired,
  email : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired
};

export default Activity;