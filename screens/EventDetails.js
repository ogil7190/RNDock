import React, { Component } from 'react';
import { Animated, Image, ScrollView, View, StyleSheet, StatusBar, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Container, Button, Icon, Fab, Grid, Col, Row, Content } from 'native-base';
import CardModal from './components/CardModal';
import LinearGradient from 'react-native-linear-gradient';

class EventDetails extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };

  state={
    data : this.props.navigation.getParam('data'),
    tapped : true,
    back  : 0,
  }

  componentDidMount(){
    this.setState({px : this.state.data.px, py : this.state.data.py, fx : this.state.data.fx, fy : this.state.fy});
    setTimeout(()=>{
      this.setState({px : 0, fx : 0, back : 10});
    }, 100);
  }
  card = '';

  handleClose = () => {
    this.card.props.onPress();
  }

  render() {
    console.log('data', this.state.data);
    return(<View style = {styles.container}>
      <Content>
        <View style ={{
          position: 'absolute',
          left: this.state.px - this.state.fx,
          top: this.state.data.py - this.state.data.fy,
        }}>
          <CardModal
            data = {this.state.data.item}
            image = {'https://mycampusdock.com/' + JSON.parse(this.state.data.item.media)[0]}
            color={'rgb(73, 150, 210)'}
            due={4}
            ref={(vrf) => this.card = vrf}
            onPress = {()=>console.log('Clicked Card')}
            tapped = {this.state.tapped}
          />
        </View>
      </Content>
    </View>);
  }
}
const styles = StyleSheet.create({
  container : {
    flex : 1,
  }
});

EventDetails.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default EventDetails;