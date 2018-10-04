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
import {DeviceEventEmitter, Dimensions, SafeAreaView, View, Image, ScrollView} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-ionicons';
import CheckOutEvent from './screens/CheckOutEvent';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import MyEvents from './screens/MyEvents';
import Settings from './screens/Settings';
import Bookmarks from './screens/Bookmarks';
import StoryPreview from './screens/StoryPreview';
import InterestSelectionScreen from './screens/InterestSelectionScreen';
import ChannelDetailScreen from './screens/ChannelDetailScreen';
import ChannelUsersScreen from './screens/ChannelUsersScreen';

const DrawerComponent = (props) =>(
  <SafeAreaView style={{flex : 1}}>
    <View style={{height : 150, backgroundColor : 'rgb(31, 31, 92)', justifyContent : 'center', alignItems : 'center', paddingTop : 20, paddingBottom :20}}>
      <Image source={require('./screens/images/icon.png')} style={{height : 100, width : 100, borderRadius : 50, tintColor : '#fff'}} />
    </View>
    <ScrollView>
      <DrawerItems {...props}/>
    </ScrollView>
  </SafeAreaView>
);

const Nav = createDrawerNavigator({
  HomeScreen: {
    screen: HomeScreen,
  },
  MyEvents : {
    screen: MyEvents,
    navigationOptions: {
      title : 'My Events',
      drawerIcon : ({ tintColor }) => IconBottomNav('albums', tintColor)
    }
  },
  Bookmarks : {
    screen : Bookmarks,
    navigationOptions: {
      title : 'My Bookmarks',
      drawerIcon : ({ tintColor }) => IconBottomNav('bookmarks', tintColor)
    }
  },
  Settings : {
    screen : Settings,
    navigationOptions: {
      title : 'My Settings',
      drawerIcon : ({ tintColor }) => IconBottomNav('settings', tintColor)
    }
  }
},{
  contentComponent : DrawerComponent,
  drawerWidth: Dimensions.get('window').width - 100
});

const Nav2 = createDrawerNavigator({
  ChannelScreen: {
    screen: ChannelScreen,
  },
  MyEvents : {
    screen: MyEvents,
    navigationOptions: {
      title : 'My Events',
      drawerIcon : ({ tintColor }) => IconBottomNav('albums', tintColor)
    }
  },
  Bookmarks : {
    screen : Bookmarks,
    navigationOptions: {
      title : 'My Bookmarks',
      drawerIcon : ({ tintColor }) => IconBottomNav('bookmarks', tintColor)
    }
  },
  Settings : {
    screen : Settings,
    navigationOptions: {
      title : 'My Settings',
      drawerIcon : ({ tintColor }) => IconBottomNav('settings', tintColor)
    }
  }
},{
  contentComponent : DrawerComponent,
  drawerWidth: Dimensions.get('window').width - 100
});

const Nav3 = createDrawerNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
  },
  MyEvents : {
    screen: MyEvents,
    navigationOptions: {
      title : 'My Events',
      drawerIcon : ({ tintColor }) => IconBottomNav('albums', tintColor)
    }
  },
  Bookmarks : {
    screen : Bookmarks,
    navigationOptions: {
      title : 'My Bookmarks',
      drawerIcon : ({ tintColor }) => IconBottomNav('bookmarks', tintColor)
    }
  },
  Settings : {
    screen : Settings,
    navigationOptions: {
      title : 'My Settings',
      drawerIcon : ({ tintColor }) => IconBottomNav('settings', tintColor)
    }
  }
},{
  contentComponent : DrawerComponent,
  drawerWidth: Dimensions.get('window').width - 100
});


const store = createStore( combineReducers({ auth, general }), applyMiddleware(logger) );

const IconBottomNav = (name, tintColor) => <Icon name={name} style={{ color: tintColor }}/>;

const Screens = createStackNavigator({
  Login: { screen: Login},
  Main: { 
    screen: createBottomTabNavigator({
      HomeScreen: {
        screen: Nav,
        navigationOptions: {
          title: 'Home',
          tabBarIcon: ({ tintColor }) => IconBottomNav('home', tintColor)
        }
      },
      ChannelScreen: { 
        screen: Nav2,
        navigationOptions: {
          title: 'Channels',
          tabBarIcon: ({ tintColor }) => IconBottomNav('glasses', tintColor)
        }
      },
      ProfileScreen: { 
        screen: Nav3,
        navigationOptions: {
          title: 'Profile',
          tabBarIcon: ({ tintColor }) => IconBottomNav('person', tintColor)
        }
      }
    },{ tabBarOptions : {
      showLabel : false,
      activeTintColor : 'orange',
      style : {height : 50, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 5}
    }}),
    navigationOptions: () => ({
      header: null
    }),
  },
  EventDetailScreen: { screen: EventDetailScreen },
  CreateProfileScreen : {screen : CreateProfileScreen},
  InterestSelectionScreen : {screen : InterestSelectionScreen},
  CheckOutEvent : { screen : CheckOutEvent},
  StoryPreview : { screen : StoryPreview},
  ChannelDetailScreen : { screen : ChannelDetailScreen},
  ChannelUsersScreen : { screen : ChannelUsersScreen},
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