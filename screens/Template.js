import React, { Component } from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return(
      <View>
        <Text>We have a template screen</Text>
      </View>
    );
  }
}

Template.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Template;