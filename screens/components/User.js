import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class User extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    };
  }


  render() {
    const item = this.props.data.item;
    const name = item.split('-')[1];
    const url  = 'https://mycampusdock.com/' + 'image0-' + item + '.webp';
    return (
      <View style={{flexDirection : 'row', backgroundColor : '#fff', margin : 5, padding : 5, borderRadius : 5, marginLeft : 10, marginRight : 10, justifyContent : 'center', alignItems : 'center'}}>
        <FastImage
          style={{height: 72, width: 72, borderRadius : 40,}}
          source={{
            uri : url,
            priority : FastImage.priority.high
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={{flex : 1, fontSize : 18, marginLeft : 10}}>{name}</Text>
        <TouchableOpacity style={{backgroundColor : 'orange', borderRadius : 20, padding : 10}}><Text style={{fontSize : 15, color : '#fff', paddingRight : 20, paddingLeft : 20}}>Ping</Text></TouchableOpacity>
      </View>
    );
  }
}

User.propTypes = {
  data : PropTypes.object.isRequired
};

export default User;