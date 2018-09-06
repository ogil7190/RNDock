import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, Container } from 'native-base';
import HomeScreen from './HomeScreen';
import ChannelScreen from './ChannelScreen';
import ProfileScreen from './ProfileScreen';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DeviceEventEmitter } from 'react-native';

const IconBottomNav = (name, tintColor) => <Icon name={name} style={{ color: tintColor }}/>;

const MainNav = createBottomTabNavigator(
  {
    HomeScreen: { 
      screen: HomeScreen,
      navigationOptions: {
        title: 'Home',
        tabBarIcon: ({ tintColor }) => IconBottomNav('home', tintColor)
      }
    },
    ChannelScreen: { 
      screen: ChannelScreen,
      navigationOptions: {
        title: 'Channels',
        tabBarIcon: ({ tintColor }) => IconBottomNav('flame', tintColor)
      }
    },
    ProfileScreen: { 
      screen: ProfileScreen,
      navigationOptions: {
        title: 'History',
        tabBarIcon: ({ tintColor }) => IconBottomNav('bookmarks', tintColor)
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: 'rgb(73, 166, 232)',
      inactiveTintColor: '#b5b5b5',
      showIcon: 'true',
      showLabel : true,
      labelStyle: {
        fontSize: 12,
      },
      elevation : 10
    }
  }
);

class Main extends Component {
  state = {
    currentScreen: 'EventScreen'
  }

  static navigationOptions = {
    header: null,
  }

  componentDidMount(){
    DeviceEventEmitter.addListener('FCM_MSSG', function(event) {
      console.log(event);
    });
  }

  render() {
    return(
      <Container>
        <MainNav screenProps={{ rootNavigation: this.props.navigation }} />
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps) (Main);