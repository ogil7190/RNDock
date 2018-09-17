import React, { Component } from 'react';
import {Platform, View, Image, StatusBar, TouchableOpacity,ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-ionicons';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  render() {
    return(
      <View style={{ flex: 1,backgroundColor : '#fff'}}>
        <StatusBar
          backgroundColor="rgb(31, 31, 92)"
          translucent
          barStyle="light-content"/>
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : 75, paddingTop : Platform.OS === 'android' ? 8 : 25, shadowOpacity : 0.6, shadowOffset : {width : 1, height : 1}, elevation : 6}}>
          <View style = {{ marginTop : Platform.OS === 'android' ? 25 : 10, flex : 1, flexDirection : 'row', paddingBottom : 5,}}>
            <TouchableOpacity onPress = {()=>this.props.navigation.openDrawer()}>
              <Icon style={{ color : '#fff', fontSize:35, padding : 5}} name='menu'/> 
            </TouchableOpacity>
            <Image style ={{width : 35, height : 35, tintColor :'#fff',flex:1, resizeMode:'contain'}}  source={require('./images/icon.png')} />
            <TouchableOpacity onPress = {()=>console.log('Search works here!')}>
              <Icon style={{ color : '#fff', fontSize:35, padding:5}} name='search' />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style = {{backgroundColor: 'transparent'}}>
        </ScrollView>
      </View>
    );
  }
}

ProfileScreen.propTypes = {
  general: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

export default connect(mapStateToProps)(ProfileScreen);