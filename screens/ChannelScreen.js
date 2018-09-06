import React, { Component } from 'react';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
class ChannelScreen extends Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return(<Text>This is the channel screen</Text>);
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