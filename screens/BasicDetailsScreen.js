import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Icon, Form, Item, Input, DatePicker } from 'native-base';
import PropTypes from 'prop-types';
import { BUNDLE_BASIC } from '../constants';

class BasicDetailsScreen extends Component {
  state = {
    title: '',
    description: '',
    regStart: null,
    regEnd: null,
    eventDate: null,
    location: '',
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.isScreenValid(false);
  }

  nextDate = (date) => {
    let nextDate = new Date(date);
    nextDate.setDate(nextDate + 1);
    return nextDate;
  };

  setRegStart = (regStart) => {
    this.setState({regStart}, () => this.isValid());
    // this.isValid();
  };

  setRegEnd = (regEnd) => {
    this.setState({regEnd}, () => this.isValid());
    // this.isValid();
  };

  setEventDate = (eventDate) => {
    this.setState({eventDate}, () => this.isValid());
    // this.isValid();
  };
  setTitle = (title) => {
    this.setState({title}, () => this.isValid());
    // this.isValid();
  };

  setDescription = (description) => {
    this.setState({description}, () => this.isValid());
    // this.isValid();
  };

  setLocation = (location) => {
    this.setState({location}, () => this.isValid());
    // this.isValid();
  };

  

  regDateValid = (start, end) => {
    if( start === null || end === null ) {
      return false;
    } else if(new Date(end) >= new Date(start)) {
      return true;
    } else {
      return false;
    }
  };

  isValid(){
    if(this.state.title.length > 5 && this.state.description.length > 5 && this.state.location.length > 2 && this.state.eventDate != null && this.regDateValid(this.state.regStart, this.state.regEnd) ){
      this.props.update_bundle({ 
        title: this.state.title, 
        description: this.state.description, 
        regStart: this.state.regStart, 
        regEnd: this.state.regEnd, 
        eventDate: this.state.eventDate, 
        location: this.state.location
      });
      this.props.isScreenValid(true);
    } else {
      console.log(this.state.title.length, this.state.description.length, this.state.location.length, this.state.eventDate, this.state.regStart, this.state.regEnd);
      this.props.isScreenValid(false);
    }
  }

  render() {
    const regDateValid = this.regDateValid(this.state.regStart, this.state.regEnd);
    return(
      <Form style = {{ marginRight : 10, marginLeft : 10}}>
        <Item>
          <Icon active name='bulb' style = {{color : 'gold'}}/>
          <Input
            border
            placeholder="What is event about?"
            maxLength={140}
            value={this.state.title}
            onChangeText={this.setTitle}
          />
        </Item>
        <Item>
          <Icon active name='list' style = {{color : 'blue'}}/>
          <Input 
            border
            placeholder="Describe the event" 
            multiline={true}
            style={{minHeight: 150}}
            maxLength={2000}
            value={this.state.description}
            onChangeText={this.setDescription}
          />
        </Item>
        <Item last>
          <Icon active name='pin' style = {{color : 'red'}}/>
          <Input 
            border
            placeholder="Where is event going to held?"
            maxLength={140}
            value={this.state.location}
            onChangeText={this.setLocation}
          />
        </Item>
        <Item style={{marginTop: 15}}>
          <Icon active name='calendar' style = {{color : 'grey'}}/>
          <DatePicker
            border
            minimumDate={new Date()}
            animationType="fade"
            placeHolderText="Event Date"
            onDateChange={this.setEventDate}
          />
        </Item>
        <Item style={{marginTop: 15}}>
          <Icon active name='person-add' style = {{color : 'green'}}/>
          <DatePicker
            border
            minimumDate={new Date()}
            placeHolderText="Registration Start"
            onDateChange={this.setRegStart}
          />
        </Item>
        <Item last style={{marginTop: 15}}>
          <Icon active name='person-add' style = {{color : 'blue'}}/>
          <DatePicker
            border
            minimumDate={new Date(this.state.regStart)}
            animationType="fade"
            placeHolderText="Registration End"
            onDateChange={this.setRegEnd}
          />
        </Item>
        <Item>
          { !regDateValid && this.state.regStart !== null && this.state.regEnd !== null && 
            <Text style={{ color: 'red', flex: 1, textAlign: 'center' }} >
              Please select valid registration date
            </Text>}
        </Item>
      </Form>
    );
  }
}

BasicDetailsScreen.propTypes = {
  isScreenValid: PropTypes.func.isRequired,
  general: PropTypes.object.isRequired,
  update_bundle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

const mapDispatchToProps = (dispatch) => {
  return {
    update_bundle: (payload) => {
      dispatch({ type: BUNDLE_BASIC, payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicDetailsScreen);


/*
<Text style={{
            marginTop: 25,
            textAlign: 'center', 
            fontWeight: 'bold',
            fontSize: 22 
          }}>
                Who is this event for ?
          </Text>
          <Item picker>
            <Picker
              mode="dropdown"
              placeholder="Categoty"
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.category}
              onValueChange={this.categoryPicker.bind(this)}
            >
              <Picker.Item label="Technology" value="Technology" />
              <Picker.Item label="Art" value="Art" />
              <Picker.Item label="Dance" value="Dance" />
              <Picker.Item label="Music" value="Music" />
            </Picker>
          </Item>
          <Item>
            <Text> Make a good tag selector here </Text>
          </Item>
          <Text style={{
            marginTop: 25,
            textAlign: 'center', 
            fontWeight: 'bold',
            fontSize: 22 
          }}>
                Select a Meaningful poster
          </Text>
          <Item>
            <Button>
              <Text onPress={this.imagePicker.bind(this)}>
                    Click Here to upload an Image
              </Text>
            </Button>
          </Item>
*/