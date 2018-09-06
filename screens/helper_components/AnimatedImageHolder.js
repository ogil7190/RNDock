import React, { Component } from 'react';
import { View, Animated } from 'react-native'; 

class AnimatedImageHolder extends Component {
  render() {
    return (
      <View>
        {this.props.children}
        <Animated.Image 
          source={this.props.source}
          style={this.props.style} 
        />
      </View>
    );
  }
}

export default AnimatedImageHolder; 