import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import PropTypes from 'prop-types';

class CustomList extends Component {
  constructor(props){
    super(props);
    this.state ={
      showTitle : 1,
      data : this.props.data,
    };
  }

  componentDidMount(){
    if(this.props.automaticTitle){
      if(this.props.data.length > 0 && this.state.showTitle === 1)
        this.setState({ showTitle : true});
      else
        this.setState({showTitle : false});
    }
  }

  render() {
    return (
      <View>
        {
          this.state.showTitle ? <Text style={{fontSize : 18, marginLeft :15, marginTop : 5, marginBottom:5}}>
            {'' + this.props.title}
            { this.props.showMark ? <Text  style={{color : 'red', fontSize : 25}}> • </Text> : ''}
          </Text> : <View/>
        }
        <View style={[this.props.style]}>
          <FlatList
            keyExtractor={(item) => item._id}
            data={this.props.data}
            horizontal = {this.props.isHorizontal ? true : false}
            showsHorizontalScrollIndicator = {false}
            renderItem={(item) => this.props.onRender(item)} />
        </View>
      </View>
    );
  }
}

CustomList.propTypes = {
  isHorizontal : PropTypes.bool,
  showMark : PropTypes.bool,
  title : PropTypes.string,
  automaticTitle : PropTypes.bool,
  style : PropTypes.object,
  showTitle : PropTypes.bool.isRequired,
  data : PropTypes.array.isRequired,
  onRender : PropTypes.func.isRequired
};

export default CustomList;