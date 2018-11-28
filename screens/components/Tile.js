import React, { Component } from 'react';
import { View} from 'react-native';
import PropTypes from 'prop-types';
import EventTile from './EventTile';
import ChannelTile from './ChannelTile';
import UserTile from './UserTile';

class Tile extends Component {
  constructor(props){
    super(props);
  }

  renderAsTypes = (type, item) =>{
    if(type === 'home') return <EventTile data = {item} onClick = {this.props.onClick} />;
    if(type === 'channels') return <ChannelTile data = {item} onClick = {this.props.onClick} />;
    if(type === 'profile') return <UserTile data = {item} onClick = {this.props.onClick} />;
  }

  render() {
    console.log(this.props.data);
    const item = this.props.data;
    return (
      <View>
        {
          this.renderAsTypes(this.props.type, item)
        }
      </View>
    );
  }
}

Tile.propTypes = {
  data : PropTypes.object.isRequired,
  type : PropTypes.string.isRequired,
  onClick : PropTypes.func.isRequired
};

export default Tile;