import React, {Component} from 'react';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import auth from './reducers/auth';
import general from './reducers/general';
import { Provider } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import EventDetailScreen from './screens/EventDetailScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import HomeScreen from './screens/HomeScreen';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';
import logger from 'redux-logger';
import {DeviceEventEmitter} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-ionicons';
import CheckOutEvent from './screens/CheckOutEvent';
import PreviewChannel from './screens/PreviewChannel';

const store = createStore( combineReducers({ auth, general }), applyMiddleware(logger) );

const IconBottomNav = (name, tintColor) => <Icon name={name} style={{ color: tintColor }}/>;

const Screens = createStackNavigator({
  Login: { screen: Login},
  Main: { 
    screen: createBottomTabNavigator({
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
          tabBarIcon: ({ tintColor }) => IconBottomNav('glasses', tintColor)
        }
      },
      ProfileScreen: { 
        screen: ProfileScreen,
        navigationOptions: {
          title: 'Profile',
          tabBarIcon: ({ tintColor }) => IconBottomNav('person', tintColor)
        }
      }
    },),
    navigationOptions: () => ({
      header: null,
    }),
  },
  EventDetailScreen: { screen: EventDetailScreen },
  CreateProfileScreen : {screen : CreateProfileScreen},
  CheckOutEvent : { screen : CheckOutEvent},
  PreviewChannel : { screen : PreviewChannel}
});

export default class App extends Component {

  UNSAFE_componentWillMount(){
    DeviceEventEmitter.addListener('FCM_MSSG', function(e) {
      console.log(e);
    });
  }

  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners('FCM_MSSG', function(e){
      console.log('Removed');
    });
  }
  
  render() {
    return(
      <Provider store={store}>
        <Screens/>
      </Provider>
    );
  }
}