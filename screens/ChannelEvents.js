import React, { Component } from 'react';
import { View, StatusBar, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-ionicons';


class ChannelDetailScreen extends Component {

  state={
    isRefreshing : false
  }

  static navigationOptions = {
    tabBarVisible : false,
  }
  
  render() {
    const { navigation } = this.props;
    const item = this.state.item == null ? navigation.getParam('item', {}) : this.state.item;
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#efefef' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>

        <View style={{padding : 20, backgroundColor : '#fff'}}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
            <FastImage
              style={{height: 72, width: 72, borderRadius : 40,}}
              source={{
                uri : item.image,
                priority : FastImage.priority.high
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{fontSize : 18, textAlign : 'left', textAlignVertical : 'center', marginLeft : 10}}>{item.name}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginLeft : 20, marginTop : 10}}>
            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 1, borderRadius : 5, margin : 5}}>
              <Text style={{fontSize : 15, color : '#333', margin : 4}}>{'Loading'}</Text>
              <Icon name = 'people' style={{margin : 4}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 1, borderRadius : 5, margin : 5}}>
              <Text style={{fontSize : 15, color : '#333', margin : 4}}>{'Loading'}</Text>
              <Icon name = 'checkmark' style={{margin : 4}}/>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', borderWidth : 1, borderRadius : 5, margin : 5}}>
              <Text style={{fontSize : 15, color : '#333', margin : 4}}>{'Loading'}</Text>
              <Icon name = 'settings' style={{margin : 4}}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{backgroundColor : 'rgb(31, 31, 92)', flexDirection : 'row',}}>
          <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,}} onPress={()=>this.props.navigation.navigate('ChannelActivity')}>
            <Text style={{fontSize : 15, color : '#fff', margin : 4, textAlign : 'center'}}>{'Activity'}</Text>
            <Icon name = 'pulse' style={{margin : 4, color : '#fff'}}/>
          </TouchableOpacity>

          <TouchableOpacity style={{flex : 1, flexDirection : 'row',  justifyContent : 'center', alignItems : 'center', margin : 2,borderWidth : 1, borderColor : '#fff', borderRadius : 3}}>
            <Text style={{fontSize : 15, color : '#fff', margin : 4, textAlign : 'center'}}>{'Events'}</Text>
            <Icon name = 'flame' style={{margin : 4, color : '#fff'}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ChannelDetailScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default ChannelDetailScreen;