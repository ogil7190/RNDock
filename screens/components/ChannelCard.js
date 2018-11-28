import React, { Component } from 'react';
import { View,Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

class ChannelCard extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <TouchableOpacity onPress = {()=> this.props.onPress()}>
        <View style={{shadowOpacity : 0.3, shadowOffset : {width : 1, height : 3}, elevation : 3, marginBottom : 10, margin : 5}}>
          <View style={{width : 180, height : 180}}>
            <View style={{flex : 6, backgroundColor : '#efefef', borderTopLeftRadius : 10, borderTopRightRadius : 10, justifyContent : 'center', alignItems : 'center'}}>
              <FastImage
                style={{width : 84, height : 84, borderRadius : 50}}
                source={{
                  uri : 'https://mycampusdock.com/' +  ( typeof this.props.data.media === 'string' ? JSON.parse(this.props.data.media)[0] : this.props.data.media[0] ),
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            
            <View style={{flex : 3, backgroundColor : '#fff', justifyContent : 'center', alignItems : 'center', borderBottomRightRadius : 8, borderBottomLeftRadius : 8}}>
              <Text 
                ellipsizeMode='tail' 
                numberOfLines={1}
                style={{marginLeft : 15, marginRight : 15, fontSize : 16}}>
                {this.props.data.name}
              </Text>

              <Text 
                ellipsizeMode='tail' 
                numberOfLines={1}
                style={{marginLeft : 15, color : '#a5a5a5', marginRight : 15, fontSize : 14}}>
                {this.props.data.category}
              </Text>
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

/*
<View style = {{height : 120, width : 0.6 * dimensions.width, marginLeft : 20, marginBottom :10, shadowOpacity : 0.5, shadowOffset : {width : 1, height : 1}, elevation : 6, backgroundColor: 'black', borderRadius:8}}>
          <View style = {{borderRadius : 8, overflow:'hidden'}}>
            <View cardBody>
              <FastImage
                style={{height: 120, width: '100%', flex: 1, position :'absolute'}}
                source={{
                  uri : 'https://mycampusdock.com/' +  ( typeof this.props.data.media === 'string' ? JSON.parse(this.props.data.media)[0] : this.props.data.media[0] ),
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)']} style={{
                width : '100%',
                height : 120,
                top: 0
              }}>
                <View style={{flex : 4}}>
                  <View style={{flexDirection :'row', marginLeft :15, marginRight : 10, marginTop:10}}>
                    <View style={{flex : 1, flexDirection :'row', justifyContent : 'flex-start', alignItems : 'center'}}>
                      <Text style={{color : 'white', textAlign:'left', fontSize : 15, fontWeight : 'bold', textAlignVertical : 'center'}}>{this.props.data.followers}</Text>
                      <Icon name={'people'} style={{color:'white', fontSize : 25, textAlignVertical : 'center', marginLeft : 5, fontWeight : 'bold'}}/>
                    </View>
                  </View>
                </View>
                <View style={{flex : 2}}>
                  <Text 
                    ellipsizeMode='tail' 
                    numberOfLines={1}
                    style={{color : 'white', marginLeft : 15, marginRight : 15, fontSize : 16, fontWeight : 'bold'}}>
                    {this.props.data.name}
                  </Text>

                  <Text 
                    ellipsizeMode='tail' 
                    numberOfLines={1}
                    style={{ color : 'white', marginLeft : 15, marginRight : 15, fontSize : 14}}>
                    {this.props.data.description}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
*/