import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-ionicons';

class InterestCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      pressed : false 
    };
  }

  handlePress = () =>{
    this.props.onPress(!this.state.pressed);
    this.setState({pressed : !this.state.pressed});
  }

  render() {
    const dim = Dimensions.get('window');
    return ( this.props.data.item.name == ' ' ? <View style={{height : dim.width / 2}}/> :
      <TouchableOpacity style={{width : dim.width / 2 - 24, height : dim.width/2, backgroundColor : '#000', borderRadius : 8, margin : 8, shadowOpacity : 0.3, shadowOffset : {width : 1, height : 1}, elevation : 3}} onPress = {()=> this.handlePress()}>
        <View>
          <FastImage
            style={{height: dim.width / 2, width: '100%', flex: 1, position :'absolute', borderRadius : 8, overflow : 'hidden'}}
            source={{uri : this.props.data.item.source, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.cover}
          />
          <LinearGradient colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.95)']} style={{
            width : '100%',
            height : dim.width / 2,
            borderRadius : 8,
            overflow : 'hidden',
            top: 0
          }}>
            <View style={{flex : 1}}>
              <View style={{flex : 2}} />
              <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{color : '#fff', fontWeight : '700', fontSize : 16, textAlign : 'center', margin : 5,}}>{this.props.data.item.name}</Text>
                { this.state.pressed ? <Icon name = 'checkmark-circle'style={{color : '#fff', fontSize : 25, fontWeight : '700'}}/>  : <View/>}
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }
}

InterestCard.propTypes = {
  data : PropTypes.object.isRequired,
  onPress : PropTypes.func.isRequired
};

export default InterestCard;