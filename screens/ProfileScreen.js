import React, { Component } from 'react';
// import { Text } from 'native-base';
import { Text } from 'react-native';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return(<Text>This is the profile screen</Text>);
  }
}

export default ProfileScreen;