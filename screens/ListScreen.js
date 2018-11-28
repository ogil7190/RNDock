import React, { Component } from 'react';
import {View, TouchableOpacity, Text, Platform, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import CustomList from './components/CustomList';
import Tile from './components/Tile';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response : {data : []}
    };
  }

  static navigationOptions = {
    header: null,
  };

  gotoTile = (type, item) =>{
    if(type === 'home') return this.props.navigation.navigate('EventDetailScreen', {item});
    if(type === 'channels') return this.props.navigation.navigate('ChannelDetailScreen', {channel_id : item._id, item : item});
    if(type === 'profile') return this.props.navigation.navigate('UserPreview', {data : item});
  }

  render() {
    const data = this.props.navigation.getParam('data', {});
    const {goBack} = this.props.navigation;
    return(
      <View style={{ flex: 1, backgroundColor : '#fff' }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="dark-content"/>

        <View style = {{ flexDirection : 'row', backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, justifyContent : 'center', alignItems : 'center'}}>
          <View>
            <TouchableOpacity onPress = {()=>goBack()} style= {{flexDirection : 'row', marginLeft : 5, marginRight : 5,  alignItems : 'center'}}>
              <Icon name="arrow-back" style={{ fontSize: 25, margin : 5}}/>
              <Text style={{fontSize : 18, marginLeft : 5}}>{'Back'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex : 1}}/>
  
          <TouchableOpacity onPress = {()=>console.log('menu')} style= {{padding : 5, marginLeft : 5, marginRight : 5}}>
            <Icon name="more" style={{ fontSize: 30}}/>
          </TouchableOpacity>
        </View>

        <CustomList
          title = 'Something'
          data={data.data}
          showTitle = {false}
          isHorizontal = {false}
          style={{marginTop : 10,}}
          onRender={({item}) => <Tile data={item} type = {data.type} onClick = {()=> this.gotoTile(data.type, item)}/>} />
      </View>
    );
  }
}

SearchScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SearchScreen;