import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';

class People extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    };
  }


  render() {
    return (
      <View style={[this.props.style]}>
        {
          this.props.count && this.props.count > 0 
            ? 
            <View style  = {{flexDirection : 'row'}}> 
              <Image style ={{width : 22, height : 22, tintColor :'#efefef', borderColor : '#fff', borderWidth : 2, backgroundColor : '#c5c5c5', borderRadius : 11, resizeMode:'contain',}}  source={require('../../images/user.png')} />
              <Image style ={{width : 22, height : 22, tintColor :'#efefef', borderColor : '#fff', borderWidth : 2, backgroundColor : '#c5c5c5', borderRadius : 11, resizeMode:'contain', marginLeft : -3,}}  source={require('../../images/user.png')} />
              <Image style ={{width : 22, height : 22, tintColor :'#efefef', borderColor : '#fff', borderWidth : 2, backgroundColor : '#c5c5c5', borderRadius : 11, resizeMode:'contain', marginLeft : -3,}}  source={require('../../images/user.png')} />
              <Text style={{fontSize : 16}}>{this.props.text}</Text>
            </View> 
            : 
            <Text style={{fontSize : 16}}>{this.props.text}</Text>
        }
      </View>
    );
  }
}

People.propTypes = {
  data : PropTypes.array.isRequired,
  style : PropTypes.object,
  count : PropTypes.string,
  text : PropTypes.string.isRequired,
};

export default People;