import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Text, Container, Input, Form, Item, DatePicker, Button } from 'native-base';
import PropTypes from 'prop-types';

// eventId: 'event id here',
// eventName: 'Sample Event Here',
// eventDescription: 'Sample Desc here',
// regStart: new Date(),
// regEnd: new Date(),
// DateCreated: new Date(),
// location: 'Some Place Nice',
// c1_name: 'Name Here',
// c1_phone: 'Phone Here',
// c2_name: 'Name Here',
// c2_phone: 'Phone Here'

class UpdateEventScreen extends Component {
  state = {
    id: 'NO-ID',
    title: 'Event is loading',
    description: 'Event Description is loading',
    regStart: null,
    regEnd: null,
    eventDate: null,
    location: 'loading',
    c1_name: 'loading',
    c1_phone: 'loading',
    c2_name: 'loading',
    c2_phone: 'loading',
    loading: false
  }
  static navigationOptions = {
    title: 'Update Event Details'
  };
  componentDidMount() {
    const id = this.props.navigation.getParam('eventId', 'NO-ID');
    this.setState({ id, loading: true });
  }
  setRegStart = (regStart) => {
    this.setState({regStart});
  }
  setRegEnd = (regEnd) => {
    this.setState({regEnd});
  }
  setEventDate = (eventDate) => {
    this.setState({eventDate});
  }
  regDateValid = (start, end) => {
    if( start === null || end === null ) {
      console.log('date is null');
      return false;
    } else if(new Date(end) >= new Date(start)) {
      console.log('date is valid');
      return true;
    } else {
      console.log('date is not valid', start, end);
      return false;
    }
  } 
  render() {
    StatusBar.setBarStyle('default', true);
    const regDateValid = this.regDateValid(this.state.regStart, this.state.regEnd);
    return(
      <Container>        
        <Text>{this.state.title}</Text>
        <Form>
          <Item>
            <Input 
              placeholder="Description"
              maxLength={140}
              value={this.state.description}
              onChangeText={(description) => this.setState({description})}
            />  
          </Item>
          <Item>
            <DatePicker
              minimumDate={new Date()}
              placeHolderText="Registration Start"
              onDateChange={this.setRegStart}
            />
            <DatePicker
              minimumDate={new Date()}
              placeHolderText="Registration End"
              onDateChange={this.setRegEnd}
            />
          </Item>
          { !regDateValid && this.state.regStart !== null && this.state.regEnd !== null && <Text style={{ color: 'red', flex: 1, textAlign: 'center' }} >Please select valid registration date</Text>}
          <Item>
            <DatePicker
              minimumDate={new Date()}
              placeHolderText="Event Date"
              onDateChange={this.setEventDate}
            />
          </Item>
          <Item>
            <Input 
              placeholder="Location"
              value={this.state.location}
              onChangeText={(location) => this.setState({location})}
            />  
          </Item>
          <Item>
            <Input 
              placeholder="Contact Name"
              value={this.state.location}
              onChangeText={(c1_name) => this.setState({c1_name})}
            />  
            <Input 
              placeholder="Phone Number"
              value={this.state.location}
              onChangeText={(c1_phone) => this.setState({c1_phone})}
            />  
          </Item>
          <Item>
            <Input 
              placeholder="Contact Name"
              value={this.state.location}
              onChangeText={(c2_name) => this.setState({c2_name})}
            />  
            <Input 
              placeholder="Phone Number"
              value={this.state.location}
              onChangeText={(c2_phone) => this.setState({c2_phone})}
            />  
          </Item>
          <Button style={{ alignSelf: 'center', marginTop: 30 }}>
            <Text>
              Submit Changes
            </Text>
          </Button>
        </Form>
      </Container>
    );
  }
}
UpdateEventScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default UpdateEventScreen;