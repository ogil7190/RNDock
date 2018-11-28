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
    let showTitle = this.props.showTitle ? true : false;
    if(this.props.automaticTitle){
      if(this.props.data.length > 0)
        showTitle = true;
      else
        showTitle = false;
    }
    return (
      <View>
        {
          showTitle ? <Text style={{fontSize : 16, marginLeft :15, marginTop : 10, marginBottom:5}}>
            {'' + this.props.title}
            { this.props.showMark ? <Text  style={{color : 'red', fontSize : 25}}> • </Text> : ''}
          </Text> : <View/>
        }
        <View style={[this.props.style]}>
          <FlatList
            ListHeaderComponent = {<View style={{width : 15}}/>}
            ListFooterComponent = {<View style={{width : 15}}/>}
            ItemSeparatorComponent = {({highlighted})=>(<View style={[{marginLeft : 5, marginRight : 5}, highlighted && {marginLeft: 5, marginRight : 5}]} />)}
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