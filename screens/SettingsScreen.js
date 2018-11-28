import React, { Component } from 'react';
import {View, Text, TouchableOpacity, ScrollView, AsyncStorage, Platform, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import Realm from '../realmdb';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null,
  };

  unsaveUser = ()=>{
    Realm.getRealm((realm)=>{
      realm.write(async () => {
        realm.deleteAll();
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login', {});
      });
    });
  }

  render() {
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>

        <View style = {{height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20}}>
          <TouchableOpacity onPress = {()=>goBack()} style= {{flexDirection : 'row', marginLeft : 5, marginRight : 5,  alignItems : 'center'}}>
            <Icon name="arrow-back" style={{ fontSize: 25, margin : 5}}/>
            <Text style={{fontSize : 20, marginLeft : 5}}>{'Back'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{margin : 10}}>
          <TouchableOpacity onPress = {()=>console.log('Profile')} style={{backgroundColor : '#efefef', borderRadius : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center', margin : 3}}>
            <Text style={{fontSize : 18, margin : 5, flex : 1, marginLeft : 10}}>{'Profile'}</Text>
            <Icon name = 'person' style={{ margin : 5, fontSize : 25, marginRight : 10}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress = {()=>console.log('Notifications')} style={{backgroundColor : '#efefef', borderRadius : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center', margin : 3}}>
            <Text style={{fontSize : 18, margin : 5, flex : 1, marginLeft : 10}}>{'Notifications'}</Text>
            <Icon name = 'notifications' style={{ margin : 5, fontSize : 25, marginRight : 10}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress = {()=>console.log('Helped')} style={{backgroundColor : '#efefef', borderRadius : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center', margin : 3}}>
            <Text style={{fontSize : 18, margin : 5, flex : 1, marginLeft : 10}}>{'Help'}</Text>
            <Icon name = 'help-circle' style={{ margin : 5, fontSize : 25, marginRight : 10}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress = {()=>this.unsaveUser()} style={{backgroundColor : '#efefef', borderRadius : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center', margin : 3}}>
            <Text style={{fontSize : 18, margin : 5, flex : 1, marginLeft : 10}}>{'Logout'}</Text>
            <Icon name = 'log-out' style={{ margin : 5, fontSize : 25, marginRight : 10}}/>
          </TouchableOpacity>

          <TouchableOpacity onPress = {()=>console.log('Told')} style={{backgroundColor : '#efefef', borderRadius : 10, flexDirection : 'row', justifyContent : 'center', alignItems : 'center', margin : 3}}>
            <Text style={{fontSize : 18, margin : 5, flex : 1, marginLeft : 10}}>{'Tell a friend'}</Text>
            <Icon name = 'heart' style={{ margin : 5, fontSize : 25, marginRight : 10}}/>
          </TouchableOpacity>
        </ScrollView>
        <Text style={{textAlign : 'center', color : '#777777'}}>Campus Dock © 2018</Text>
      </View>
    );
  }
}

SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SettingsScreen;