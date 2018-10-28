import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

class Template extends Component {
  constructor(props){
    super(props);
    this.state = {
     
    };
  }


  render() {
    const dim = Dimensions.get('window');
    return (
      <TouchableOpacity style={{width : dim.width / 2, height : dim.width / 3, backgroundColor : '#000'}}>
        <View/>
      </TouchableOpacity>
    );
  }
}

Template.propTypes = {
  something : PropTypes.object.isRequired
};

export default Template;