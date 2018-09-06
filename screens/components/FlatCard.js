import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Card, CardItem, Text, Icon } from 'native-base';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

class FlatCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      card : '',
    };
  }

  card = '';

  handleDate(date){
    var d = Date.parse(date);
    console.log(d);
    return ''+ d;
  }

  render() {    
    return (
      <TouchableWithoutFeedback onPress={ () => this.props.onPress(this.card)}>
        <View ref={(viewRef) => this.card = viewRef} style = {{height : 300, marginTop : 8, marginBottom : 8}}>
          <Card style = {{borderRadius : 12, overflow : 'hidden', elevation : 5}}>
            <CardItem cardBody style={{borderRadius : 12,}}>
              <FastImage
                style={{height: 300, width: '100%', flex: 1, position :'absolute',  borderRadius:12}}
                source={{
                  uri : this.props.image,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={{
                width : '100%',
                height : 300,
                top: 0
              }}>
                <View style={{flexDirection :'row', marginLeft :15, marginRight : 0, marginTop:10}}>
                  <View style={{flexDirection : 'row', flex:1}}>
                    <FastImage
                      style= {{width : 36, height : 36, borderRadius : 25}}
                      source={{
                        uri : 'https://imagens.canaltech.com.br/137091.237729-Logos-estilo-Instagram.png',
                        priority: FastImage.priority.high,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text 
                      style={{color : 'white', textAlign:'left', marginLeft : 15,  fontSize : 15, fontWeight : '600'}}>
                      {this.props.channel}
                    </Text>
                  </View>
                </View>
                <Text 
                  style={{color : 'white', marginLeft : 15, marginRight : 15, marginTop : 80, fontSize : 25, fontWeight : '500'}}>
                  {this.props.title}
                </Text>
                <Text 
                  style={{color : 'white', marginLeft : 15, marginRight : 15, marginTop : 40, fontSize : 15}}>
                  <Icon name='pin' style={{color:'white', fontSize:20}}/>
                  {'  '+this.props.data.location}
                </Text>
                <Text 
                  style={{color : 'white', marginLeft : 15, marginRight : 15, marginTop : 10, fontSize : 15}}>
                  <Icon name='calendar' style={{color:'white', fontSize:20}}/>
                  {
                    '  '+('' + this.props.data.date).substring(0, 15)
                  }
                </Text>
              </LinearGradient>
            </CardItem>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FlatCard.propTypes = {
  image : PropTypes.string.isRequired,
  title : PropTypes.string.isRequired,
  data : PropTypes.object.isRequired,
  channel : PropTypes.string.isRequired,
  onPress : PropTypes.func.isRequired
};

export default FlatCard;