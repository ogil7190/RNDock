import React, { Component } from 'react';
import { View, Dimensions, AsyncStorage } from 'react-native';
import { Card, CardItem, Text, Icon } from 'native-base';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import axios from 'axios';

class FlatCardChannel extends Component {
  constructor(props){
    super(props);
    this.state = {
      subscribed_icon : 'add-circle',
    };
  }

  handleSubscription = async () =>{
    const str = await AsyncStorage.getItem('data');
    const data = JSON.parse(str);
    const token = data.token;
    const channel = this.props.channel;
    const response = await axios.post('https://mycampusdock.com/channels/user/susbcribe', { channel }, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    });
    console.log(response);
    if(!response.data.error){
      this.setState({subscribed_icon : 'checkmark-circle'});
    }
  }

  render() {
    const dimensions = Dimensions.get('window');
    return (
      <View style = {{height : 120, width : 0.7 * dimensions.width, marginBottom : 10}}>
        <Card style = {{borderRadius : 8, overflow:'hidden'}}>
          <CardItem cardBody>
            <FastImage
              style={{height: 120, width: '100%', flex: 1, position :'absolute'}}
              source={{
                uri : this.props.image,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.55)']} style={{
              width : '100%',
              height : 120,
              top: 0
            }}>
              <View style={{flexDirection :'row', marginLeft :10, marginRight : 0, marginTop:5}}>
                <Text 
                  style={{color : 'white', flex:1, textAlign:'left', fontSize : 12, fontWeight : '500'}}>
                  {this.props.channel}
                </Text>
                <Icon size={15} name={this.state.subscribed_icon} style={{color:'white'}} onPress={this.handleSubscription}/>
              </View>
              <Text 
                style={{color : 'white', marginLeft : 10, marginRight : 10, marginTop : 50, fontSize : 14}}>
                {this.props.title}
              </Text>
            </LinearGradient>
          </CardItem>
        </Card>
      </View>
    );
  }
}

FlatCardChannel.propTypes = {
  image : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  data : PropTypes.string.isRequired,
  url : PropTypes.string.isRequired,
  channel : PropTypes.string.isRequired
};

export default FlatCardChannel;