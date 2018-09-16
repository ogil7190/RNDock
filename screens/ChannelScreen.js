import React, { Component } from 'react';
import { Text, AsyncStorage } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class ChannelScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    
  }

  unsaveUser = async ()=>{
    this.googleSignOut();
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('Logged out!');
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  render() {
    return(<Text onPress={this.unsaveUser}>This is the channel screen</Text>);
  }
}
const mapStateToProps = (state) => {
  return { general: state.general };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     update_screen: (screen_name, header_name) => {
//       dispatch({
//         type: UPDATE_SCREEN,
//         payload: {
//           screen_name,
//           header_name
//         }
//       });
//     }
//   };
// };

ChannelScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(ChannelScreen);