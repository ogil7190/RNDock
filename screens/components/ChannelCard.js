import React, { Component } from 'react';
import { View, Dimensions,Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ionicons';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

class ChannelCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      subscribed_icon : 'add-circle',
    };
  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <TouchableOpacity onPress = {()=> this.props.onPress()}>
        <View style = {{height : 150, width : 0.6 * dimensions.width, marginLeft : 20, marginBottom :10, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 6, backgroundColor: 'black', borderRadius:8}}>
          <View style = {{borderRadius : 8, overflow:'hidden'}}>
            <View cardBody>
              <FastImage
                style={{height: 150, width: '100%', flex: 1, position :'absolute'}}
                source={{
                  uri : this.props.data.image,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.7)']} style={{
                width : '100%',
                height : 150,
                top: 0
              }}>
                <View style={{flex : 5}}>
                  <View style={{flexDirection :'row', marginLeft :15, marginRight : 10, marginTop:10}}>
                    <View style={{flex : 1, flexDirection :'row', justifyContent : 'flex-start', alignItems : 'center'}}>
                      <Text style={{color : 'white', textAlign:'left', fontSize : 12, fontWeight : '500', textAlignVertical : 'center'}}>{'250+'}</Text>
                      <Icon name={'people'} style={{color:'white', fontSize : 25, textAlignVertical : 'center', marginLeft : 5}}/>
                    </View>
                  </View>
                </View>
                <View style={{flex : 2}}>
                  <Text 
                    style={{color : 'white', marginLeft : 15, marginRight : 15, fontSize : 14}}>
                    {this.props.data.name}
                  </Text>
                  <Text 
                    ellipsizeMode='tail' 
                    numberOfLines={1}
                    style={{ color : 'white', marginLeft : 15, marginRight : 15, fontSize : 12}}>
                    {this.props.data.college}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ChannelCard.propTypes = {
  data : PropTypes.object.isRequired,
  onPress : PropTypes.func.isRequired
};

export default ChannelCard;