import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Text, View, Platform, AsyncStorage, Image, ActionSheetIOS, TextInput, StatusBar, Picker, ScrollView, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { AUTH_USER } from '../constants';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import FirebaseModule from './FirebaseModule';
import Icon from 'react-native-ionicons';

const colleges = {
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
    if(this.checkFields()){
      this.setState({loading : true});
      const formData = new FormData();
      formData.append('name', this.state.name);
      formData.append('email', this.state.email);
      formData.append('college', this.state.college);
      formData.append('gender', this.state.gender);
      formData.append('mobile', this.state.mobile);
      formData.append('pic', this.state.pic);
      if(this.state.pic !== null) {
        formData.append('image0',{ uri: this.state.pic, type: 'image/jpeg', name: 'user' });
      }
      const response = await axios.post('https://mycampusdock.com/auth/new-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.state.token
        }
      });
      if(response.data.error){
        console.log('Something went wrong');
      } else {
        console.log(response);
        this.update(JSON.stringify(response.data));
        this.handleSubscription();
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'InterestSelectionScreen' })],
        });
        this.setState({loading : false});
        this.props.navigation.dispatch(actionToDispatch);
      }
    }
  }

  handleSubscription = () =>{
    FirebaseModule.subscribeTag(this.state.email);
    FirebaseModule.subscribeTag(this.state.college);
    FirebaseModule.subscribeTag(this.state.mobile);
    FirebaseModule.subscribeTag('ogil7190');
    FirebaseModule.subscribeTag('menime');
  }

  update = async (data) =>{
    await AsyncStorage.setItem('data', JSON.stringify(data));
    await AsyncStorage.setItem('interest', '0');
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
          pic : response.uri
        });
      }
    });
  }

  collegeAction = () =>{
    var selections = ['Cancel'];
    Object.entries(colleges).map( (data) => selections.push(data[0]));
    ActionSheetIOS.showActionSheetWithOptions({
      options: selections,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if(buttonIndex != 0)
        this.setState({college : selections[buttonIndex]});
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
        <View style = {{ backgroundColor : 'transparent', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, flex : 1}}>
          <ScrollView
            scrollEventThrottle={5}>
            <View style = {{ marginTop : 10, flex : 1}}> 
              <View style={{ marginTop:10, marginBottom:10, marginLeft:15, marginRight:15, overflow: 'hidden' }}>
                <View style={{ backgroundColor: 'transparent', flex: 1}}>
                  <Text
                    style={{borderColor : '#fff', color : '#fff', fontSize : 18, fontWeight : '100',  textAlign : 'center'}}>
                      Update Your Profile
                  </Text>  
                </View>
              </View>

              <View style={{justifyContent : 'center', backgroundColor : '#fff', borderRadius:8, marginTop:5, marginRight : 15, marginLeft : 15}}>
                <TouchableOpacity onPress={this.handlePicUpload}>  
                  <View>
                    <Image style={{marginTop:10, width : 90, height : 90, borderRadius : 45, alignSelf:'center'}} source={{uri: this.state.pic}} />
                    <Text style={{marginBottom : 5, textAlign : 'center', color:'rgb(31, 31, 92)', marginTop: 5}} onPress={this.handlePicUpload}>Select Pic</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop:15, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden', flexDirection : 'row', alignItems : 'center' }}>
                <Icon style={{ paddingLeft: 20, padding:8, color : this.state.name_check ? '#f00' : '#000'}} name="person" />
                <View style={{ backgroundColor: 'transparent', flex: 1, alignSelf:'center', padding : 8}}>
                  <TextInput
                    style={{paddingLeft : 10,textAlignVertical : 'center', fontSize : 18}}
                    maxLength={50}
                    returnKeyType = "next"
                    placeholder="Your Full Name"
                    value={this.state.name}
                    onChangeText={(text) => this.handleChange('name', text)}
                  />  
                </View>
              </View>
        
              <View style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden', flexDirection : 'row', alignItems : 'center'}}>
                <Icon style={{ paddingLeft: 20, padding: 8, color : this.state.email_check ? '#f00' : '#000' }} name="mail" />
                <View style={{ backgroundColor: 'transparent', flex: 1, alignSelf:'center', padding : 8}}>
                  <TextInput
                    editable = {false}
                    style={{paddingLeft : 10, textAlignVertical : 'center', fontSize : 18}}
                    maxLength={50}
                    placeholder="Your E-mail"
                    returnKeyType = "next"
                    value={this.state.email}
                    onChangeText={(text) => this.handleChange('email', text)}
                  />  
                </View>
              </View>

              <View style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden', flexDirection : 'row', alignItems : 'center'}}>
                <Icon style={{ paddingLeft: 20, padding: 8, color : this.state.mobile_check ? '#f00' : '#000' }} name="call" />
                <View style={{ backgroundColor: 'transparent', flex: 1, alignSelf:'center', padding : 8}}>
                  <TextInput
                    style={{paddingLeft : 10, textAlignVertical : 'center', fontSize : 18}}
                    maxLength={10}
                    placeholder="Your Mobile"
                    keyboardType = "phone-pad"
                    returnKeyType = "next"
                    value={this.state.mobile}
                    onChangeText={(text) => this.handleChange('mobile', text)}
                  />  
                </View>
              </View>


              <View style={{ backgroundColor: '#fff', marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden', flexDirection : 'row', alignItems : 'center'}}>
                <Icon style={{ paddingLeft: 20, padding: 8, color : this.state.college_check ? '#f00' : '#000' }} name="school" />
                <View style={{ backgroundColor: 'transparent', flex: 1, alignSelf:'center', padding : 8}}>
                  {Platform.OS === 'android' ? <Picker
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
                  </Picker> :
                    <Text
                      style={{paddingLeft : 10, textAlignVertical : 'center', color : '#000', fontSize : 18}}
                      onPress = {this.collegeAction}
                      numberOfLines = {1}
                      ellipsizeMode = "tail">{this.state.college}</Text>
                  }
                </View>
              </View>

              <View style={{ backgroundColor:'transparent', flex : 1, }}>
                <View style={{flexDirection : 'row'}}>
                  <View style={{ backgroundColor: '#fff', flex : 1, marginTop:10, marginBottom:5, marginLeft:15, marginRight:15, borderRadius: 8, overflow: 'hidden', flexDirection : 'row', justifyContent: 'center'}}>
                    <View style={{ justifyContent: 'center', flex : 1, padding : 5 }}>
                      <Icon name="male" style={{ textAlign: 'center', fontSize: 36, }} />
                      <Text style={{ textAlign: 'center'}}>Male</Text>
                      <Icon name={ this.state.gender === 'M' ? 'radio-button-on' : 'radio-button-off' } style={{ textAlign: 'center', }} onPress={ () => this.setState({ gender: 'M' }) } />
                    </View>
                    <View style={{justifyContent: 'center', flex:1, padding : 5 }}>
                      <Icon name="female" style={{ textAlign: 'center', fontSize: 36,  }} />
                      <Text style={{ textAlign: 'center'}}>Female</Text>
                      <Icon name={ this.state.gender === 'F' ? 'radio-button-on' : 'radio-button-off' } style={{ textAlign: 'center', }} onPress={ () => this.setState({ gender: 'F' }) } />
                    </View>
                  </View>
                </View>
                <View style={{ marginBottom : 20, backgroundColor:'transparent',padding : 5}}>
                  <TouchableOpacity disabled = {this.state.loading} style={{ justifyContent: 'center', alignItems : 'center',  marginTop : 20, padding : 10, }} onPress={this.handleSubmit}>
                    <View style={{flexDirection : 'row', backgroundColor: '#3f3f76', borderRadius :30, padding: 5}}>
                      <Text style={{color:'#fff', paddingLeft : 50, paddingRight : 5, padding : 5,  fontSize : 20,  textAlign : 'center', textAlignVertical : 'center'}}>
                        {'Continue '}
                      </Text>
                      <Icon name="arrow-forward" style= {{ textAlign : 'center', fontSize : 25, color : '#fff', padding: 5, paddingRight : 50}}/>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
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