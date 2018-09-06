import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Platform, AsyncStorage, StatusBar, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { AUTH_USER } from '../constants';
import ImagePicker from 'react-native-image-picker';
import { Text, Item, Thumbnail, Icon, Input, Form, Picker, Grid, Col, Button, Row, Spinner, Container, Content } from 'native-base';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import FirebaseModule from './FirebaseModule';

colleges = {
  'Select College' : 'Select College',
  'MRIIRS' : 'Manav Rachna International Institute of Research & Studies',
  'MREI': 'Manav Rachna Educational Institute'
};
class CreateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token : this.props.auth.token,
      data : this.props.auth.data,
      name : this.props.auth.data.name,
      email : this.props.auth.data.email,
      mobile : '',
      pic : this.props.auth.data.photo === undefined ? this.props.auth.data.picture.data.url : this.props.auth.data.photo,
      imageFile : null,
      college : 'Select College',
      gender: 'M',
      loading : false,
      name_check : false,
      email_check : false,
      mobile_check : false,
      college_check : false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  handleChange = (name, value) =>{
    this.setState({ [name]: value });
  }

  handleSubmit = async ()=>{
    console.log('token', this.state.token);
    if(this.checkFields()){
      this.setState({loading : true});
      const formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('email', this.state.email);
      formData.append('college', this.state.college);
      formData.append('gender', this.state.gender);
      formData.append('mobile', this.state.mobile);
      formData.append('pic', this.state.pic);
      if(this.state.imageFile !== null) {
        formData.append('image0',{ uri: this.state.imageFile, type: 'image/jpeg', name: 'user' });
      }
      const response = await axios.post('https://mycampusdock.com/auth/android/new-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state.token
        }
      });
      if(response.data.error){
        console.log('Something went wrong');
      } else {
        this.update(JSON.stringify(response.data));
        this.handleSubscription();
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
        this.setState({loading : false});
      }
    }
  }

  handleSubscription = () =>{
    FirebaseModule.subscribeTag('ogil');
    FirebaseModule.subscribeTag('menime');
    FirebaseModule.subscribeTags(['Fuck', 'ogil7190']);
  }

  update = async (data) =>{
    await AsyncStorage.setItem('data', ''+data);
    console.log('Data updated : ', data);
  }

  isValidEmail = (email) =>{
    var re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    return re.test(email);
  }

  checkFields = ()=>{
    var error = false;
    if(this.state.name.length < 3){
      error = true;
      this.handleChange('name_check', true);
    } else {
      this.handleChange('name_check', false);
    }

    if(!this.isValidEmail(this.state.email)){
      error = true;
      this.handleChange('email_check', true);
    } else {
      this.handleChange('email_check', false);
    }

    if(this.state.college === 'Select College'){
      error = true;
      this.handleChange('college_check', true);
    } else {
      this.handleChange('college_check', false);
    }

    if(this.state.mobile.length < 10 ){
      error = true;
      this.handleChange('mobile_check', true);
    } else {
      this.handleChange('mobile_check', false);
    }
    return !error;
  }

  handlePicUpload = () =>{
    var options = {
      title: 'Select your Pic',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          imageFile: response.uri
        });
      }
    });
  }

  render() {
    return(
      <LinearGradient colors={['rgb(31, 31, 92)', 'rgb(73, 166, 232)']} 
        style={{flex: 1}}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"/>
        <Container style = {{ backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, flex : 1}}>
          <Content
            scrollEventThrottle={5}>
            <Form style = {{ marginTop : 10, flex : 1}}> 

              <Item style={{ marginTop:10, marginBottom:10, marginLeft:15, marginRight:15, overflow: 'hidden' }}>
                <View style={{ backgroundColor: 'transparent', flex: 1}}>
                  <Text
                    style={{borderColor : '#fff', color : '#fff', fontSize : 18, fontWeight : '100',  textAlign : 'center'}}>
                  Update Profile
                  </Text>  
                </View>
              </Item>

              <Item style={{justifyContent : 'center', backgroundColor : '#fff', borderRadius:8, marginTop:5, marginRight : 15}}>
                <TouchableOpacity key={1} onPress={this.handlePicUpload}>  
                  <View>
                    <Thumbnail style={{marginTop:10, width : 90, height : 90}} large source={{uri: this.state.imageFile == null ?  this.state.pic : this.state.imageFile}} />
                    <Text style={{marginBottom : 5, textAlign : 'center', color:'rgb(73, 166, 232)', marginTop: 5}} onPress={this.handlePicUpload}>Select Pic</Text>
                  </View>
                </TouchableOpacity>
              </Item>

              <Item error = {this.state.name_check} style={{ backgroundColor: '#fff', marginTop:15, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden' }}>
                <Icon size={20} style={{ paddingLeft: 20, paddingRight: 20, width: 60  }} name="person" />
                <View style={{ backgroundColor: 'transparent', height: 50, flex: 1}}>
                  <Input
                    style={{paddingLeft : 10, borderColor : 'transparent'}}
                    maxLength={50}
                    placeholder="Your Full Name"
                    value={this.state.name}
                    onChangeText={(text) => this.handleChange('name', text)}
                  />  
                </View>
              </Item>
        
              <Item error = {this.state.email_check}  style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden' }}>
                <Icon size={20} style={{ paddingLeft: 20, paddingRight: 20, width: 60  }} name="mail" />
                <View style={{ backgroundColor: 'transparent', height: 50, flex: 1}}>
                  <Input
                    disabled
                    style={{paddingLeft : 10}}
                    maxLength={50}
                    placeholder="Your E-mail"
                    value={this.state.email}
                    onChangeText={(text) => this.handleChange('email', text)}
                  />  
                </View>
              </Item>

              <Item error = {this.state.mobile_check} style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden' }}>
                <Icon size={20} style={{paddingLeft: 20, paddingRight: 20, width: 60  }} name="call" />
                <View style={{ backgroundColor: 'transparent',  height: 50, flex: 1}}>
                  <Input
                    style={{paddingLeft : 10}}
                    maxLength={50}
                    placeholder="Your Mobile Number"
                    onChangeText={(text) => this.handleChange('mobile', text)}
                  />  
                </View>
              </Item>

              <Item error = {this.state.college_check} style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden' }}>
                <Icon size={20} style={{paddingLeft: 20, paddingRight: 20, width: 60  }} name="school" />
                <View style={{ backgroundColor: 'transparent', height: 50, flex: 1}}>
                  <Picker
                    style={{}}
                    mode="dropdown"
                    placeholder="Select College"
                    disabled = {this.state.loading}
                    placeholderStyle={{ color: '#000' }}
                    selectedValue={this.state.college}
                    onValueChange={(text) => this.handleChange('college', text)}
                    note={false}>
                    {
                      Object.entries(colleges).map( (data, index) => <Picker.Item label= {data[1]} value={data[0]} key = {index} />)
                    }
                  </Picker>
                </View>
              </Item>

              <Grid style={{ backgroundColor:'transparent', flex : 1 }}>
                <Col>
                  <Row style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden'}}>
                    <Col style={{ justifyContent: 'center', padding : 5 }}>
                      <Icon name="male" style={{ textAlign: 'center', fontSize: 36, }} />
                      <Text style={{ textAlign: 'center'}}>Male</Text>
                      <Icon name={ this.state.gender === 'M' ? 'radio-button-on' : 'radio-button-off' } style={{ textAlign: 'center', }} onPress={ () => this.setState({ gender: 'M' }) } />
                    </Col>
                    <Col style={{justifyContent: 'center', padding : 5 }}>
                      <Icon name="female" style={{ textAlign: 'center', fontSize: 36,  }} />
                      <Text style={{ textAlign: 'center'}}>Female</Text>
                      <Icon name={ this.state.gender === 'F' ? 'radio-button-on' : 'radio-button-off' } style={{ textAlign: 'center', }} onPress={ () => this.setState({ gender: 'F' }) } />
                    </Col>
                  </Row>
                  <Row style={{ flex : 1, marginBottom : 20,  justifyContent: 'center', alignItems : 'center', backgroundColor:'transparent'}}>
                    <Button disabled = {this.state.loading} rounded style={{ backgroundColor: '#fff', marginTop : 20, padding : 10}} iconRight onPress={this.handleSubmit}>
                      <Text style={{color:'black'}}>
                    Continue
                      </Text>
                      <Icon name="arrow-forward" size ={30} style= {{ textAlign : 'center', color : 'black'}}/>
                    </Button>
                  </Row>
                </Col>
              </Grid>
            </Form>
          </Content>
        </Container>
      </LinearGradient>
    );
  }
}

CreateProfileScreen.propTypes = {
  auth: PropTypes.object.isRequired,
  update_store: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

const mapDispatchToProps = (dispatch) => {
  return {
    update_store: () => {
      dispatch({ type: AUTH_USER });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfileScreen);