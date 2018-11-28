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
import StoryPreview from './screens/StoryPreview';
import InterestSelectionScreen from './screens/InterestSelectionScreen';
import ChannelDetailScreen from './screens/ChannelDetailScreen';
import ChannelUsersScreen from './screens/ChannelUsersScreen';
import SearchScreen from './screens/SearchScreen';
import UserPreview from './screens/UserPreview';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';

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
          tabBarIcon: ({ tintColor }) => IconBottomNav('planet', tintColor)
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
    },{ tabBarOptions : {
      showLabel : true,
      activeTintColor : 'orange',
      style : {height : 50, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5}
    }}),
    navigationOptions: () => ({
      header: null
    }),
  },
  EventDetailScreen: { screen: EventDetailScreen },
  SearchScreen: { screen: SearchScreen },
  CreateProfileScreen : {screen : CreateProfileScreen},
  InterestSelectionScreen : {screen : InterestSelectionScreen},
  CheckOutEvent : { screen : CheckOutEvent},
  StoryPreview : { screen : StoryPreview},
  ChannelDetailScreen : { screen : ChannelDetailScreen},
  ChannelUsersScreen : { screen : ChannelUsersScreen},
  UserPreview : { screen : UserPreview},
  SettingsScreen : { screen : SettingsScreen},
  ListScreen : { screen : ListScreen},
});

export default class App extends Component {

  UNSAFE_componentWillMount(){
    DeviceEventEmitter.addListener('FCM_MSSG', function(e) {
      console.log(e);
    });
  }

  componentWillUnmount(){
    DeviceEventEmitter.removeAllListeners('FCM_MSSG', function(e){
      console.log('Removed', e);
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