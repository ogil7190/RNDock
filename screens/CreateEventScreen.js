import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Text, Icon, Title, Button, Fab, Toast } from 'native-base';
import PropTypes from 'prop-types';
import { Platform, Animated, StatusBar, View, BackHandler } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import MediaSelectionScreen from './MediaSelectionScreen';
import BasicDetailsScreen from './BasicDetailsScreen';
import ContactDetailsScreen from './ContactDetailsScreen';
import PaymentInfoScreen from './PaymentInfoScreen';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { BUNDLE_FLUSH } from '../constants';

const labels = ['', '', '', ''];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: 'red',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: 'red',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: 'red',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: 'red',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 16,
  stepIndicatorLabelCurrentColor: 'red',
  stepIndicatorLabelFinishedColor: '#fff',
  stepIndicatorLabelUnFinishedColor: '#1b75bc',
  labelColor: '#1b75bc',
  labelSize: 13,
  currentStepLabelColor: '#1b75bc'
};

// For animations
const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 120;

class CreateEventScreen extends Component {
  constructor(props) {
    super(props);
    this.isScreenValid = this.isScreenValid.bind(this);
    this.onBackClicked = this._onBackClicked.bind(this);
    this.submit_form = this.submit_form.bind(this);
    this.form_send_helper = this.form_send_helper.bind(this);
  }
  
  state = {
    currentPosition: 0,
    scrollY: new Animated.Value(0),
    screenValid: false
  }
  static navigationOptions = {
    header: null
  };

  handleNext = () => {
    if(this.state.currentPosition === 3) {
      return this.submit_form();
    }
    if(this.state.screenValid) {
      this.setState({currentPosition: this.state.currentPosition + 1});
    } else {
      this.showToast('Fill data properly!');
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackClicked);
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked);
    }
  }
  _onBackClicked = () => {
    return true;
  } 

  isScreenValid = (screenValid) => {
    this.setState({ screenValid });
  }

  form_send_helper = async (formData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if( token === null) return;
      axios.post('https://mycampusdock.com/events/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': token
        }
      }).then( response => {
        console.log(response);
      } )
        .catch( err => {
          console.log(err);
        });
  
    } catch (error) {
      console.log(error);
    }
  };

  submit_form = () => {
    console.log(this.props.general);
    const formData = new FormData();
    formData.append('title', this.props.general.title);
    formData.append('description', this.props.general.description);
    formData.append('location', this.props.general.location);
    formData.append('category', this.props.general.category);
    formData.append('tags', JSON.stringify(this.props.general.tags) );
    formData.append('reg_start', new Date(this.props.general.regStart).toDateString());
    formData.append('reg_end', new Date(this.props.general.regEnd).toDateString());
    formData.append('date', new Date(this.props.general.eventDate).toDateString());
    formData.append('contact_details', JSON.stringify({ 
      [ this.props.general.c1_name ] : this.props.general.c1_phone, 
      [ this.props.general.c2_name ] : this.props.general.c2_phone  
    }));
    formData.append('faq', this.props.general.faq);
    formData.append('price', this.props.general.price);
    formData.append('available_seats', this.props.general.seats);
    formData.append('image0', this.props.general.eventFile);
    this.form_send_helper(formData);
  }

  getScreen = (pos) =>{
    switch(pos){
    case 0 :
      return(<BasicDetailsScreen isScreenValid = {this.isScreenValid}/>);
    case 1:
      return(<MediaSelectionScreen isScreenValid = {this.isScreenValid}/>);
    case 2:
      return(<ContactDetailsScreen isScreenValid = {this.isScreenValid}/>);
    case 3:
      return(<PaymentInfoScreen isScreenValid = {this.isScreenValid}/>);
    }
  } 

  getScreenName = (pos) =>{
    switch(pos){
    case 0 :
      return 'Fill Basic Details';
    case 1:
      return 'Fill Media Details';
    case 2:
      return 'Fill Contact Details';
    case 3:
      return 'Fill Payment Details';
    }
  }

  showToast(text){
    console.log('Toast', Toast);
    Toast.show({
      text: text,
      buttonText: 'Okay'
    });
  }

  render() {
    StatusBar.setBarStyle('light-content', true);  
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });
    const headerDataRange = this.state.scrollY.interpolate({
      inputRange: [0, 
        HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 10, 
        HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 15,
        HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 37,
      ],
      outputRange: [-20, -20, 0, 5 ],
      extrapolate: 'clamp'
    });

    const headerStuff = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 15],
      outputRange: [Platform.OS === 'android' ? 10 : 30  , Platform.OS === 'android' ? 5 : 15, -50],
      extrapolate: 'clamp'
    });

    const stepperRange = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT-HEADER_MIN_HEIGHT + 15],
      outputRange: [HEADER_MAX_HEIGHT - 40, HEADER_MIN_HEIGHT/2 - 15, HEADER_MIN_HEIGHT/2- 15],
      extrapolate: 'clamp'
    });

    return(
      <Container>
        <Animated.View style={{ 
          position: 'absolute',  
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#1b75bc',
          height: headerHeight,
          zIndex: 1
        }}>
          <Animated.View 
            style={{
              position: 'absolute',
              top: headerStuff,
              left: 15
            }}
          >
            <Title style={{ fontSize: 30, color: '#fff' }}>Create New Event</Title>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              top: stepperRange,
              left: 0,
              right: 0,
              width: '100%'
            }}
          >
            <StepIndicator
              stepCount = {labels.length}
              customStyles={customStyles}
              currentPosition={this.state.currentPosition}
              labels={labels}
            />
          </Animated.View>
          <Animated.View 
            style={{
              position: 'absolute',
              top: Platform.OS === 'android' ? 6 : headerStuff,
              right: 10,
            }}
          >
            <Button 
              transparent
              onPress={() => { StatusBar.setBarStyle('default', true); this.props.navigation.navigate('HomeScreen'); }}>
              <Icon name="close" style={{ color: '#fff', fontSize: 28 }} />
            </Button>
          </Animated.View>
          <Animated.View 
            style={{
              position: 'absolute',
              bottom: headerDataRange,
              right: 0,
              left: 0,
              alignItems: 'center'
            }}
          >
            <Title style={{ color: '#fff'}}>{this.getScreenName(this.state.currentPosition)}</Title>
          </Animated.View>
        </Animated.View>

        <Content
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )}
        >
          <Text style={{
            marginTop: HEADER_MAX_HEIGHT+10, 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: 22 
          }}>
            {this.getScreenName(this.state.currentPosition)}
          </Text>
          <View style={{ marginBottom: 80 }}>
            {this.getScreen(this.state.currentPosition)}
          </View>
        </Content>

        <Fab
          active={false}
          direction="up"
          containerStyle={{ }}
          style={{ backgroundColor: 'red' }}
          position="bottomRight"
          onPress={this.handleNext}>
          <Icon name={this.state.currentPosition !== 3 ? 'arrow-forward' : 'checkmark' } />
        </Fab>
      
      </Container>
    );
  }
}

CreateEventScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
  flush_bundle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return { general: state.general };
};

const mapDispatchToProps = (dispatch) => {
  return {
    flush_bundle: () => {
      dispatch({ type: BUNDLE_FLUSH });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen);