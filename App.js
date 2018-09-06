import React, {Component} from 'react';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Root } from 'native-base';
import auth from './reducers/auth';
import general from './reducers/general';
import { Provider } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import CreateEventScreen from './screens/CreateEventScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import EventDetails from './screens/EventDetails';
import UpdateEventScreen from './screens/UpdateEventScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';
import HomeScreen from './screens/HomeScreen';
import ChannelScreen from './screens/ChannelScreen';
import ProfileScreen from './screens/ProfileScreen';
import logger from 'redux-logger';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'native-base';

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

  //EventDetails: {screen: EventDetails},
  CreateEventScreen: { screen: CreateEventScreen },
  EventDetailScreen: { screen: EventDetailScreen },
  UpdateEventScreen: { screen: UpdateEventScreen },
  CreateProfileScreen : {screen : CreateProfileScreen}
});

export default class App extends Component {
  render() {
    
    return(
      <Provider store={store}>
        <Root>
          <Screens/>
        </Root>
      </Provider>
    );
  }
}