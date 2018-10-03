import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform, StatusBar, View, Image, ActivityIndicator, AsyncStorage} from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import PropTypes from 'prop-types';
import { AUTH_USER } from '../constants';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icons from './icons';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';

const Logo_white = () => Icons.logo_white;
const Icon_inst = () => Icons.icon_inst;
const Icon_student = () => Icons.icon_student;
const Icon_trophy = () => Icons.icon_trophy;
const Icon_book = () => Icons.icon_book;

class Login extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.loading = this.loading.bind(this);
    this.state = {
      user: null,
      error: null,
      error_text : null,
      loading: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  async UNSAFE_componentWillMount() {
    await this.checkuserExists();
    await this.configureGoogleSignIn();
  }

  async configureGoogleSignIn() {
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    const configPlatform = {
      ...Platform.select({
        ios: {
          iosClientId: '7449865696-f0gevigpsirhflrihhvvhh1h18st6ujg.apps.googleusercontent.com',
        },
        android: {},
      }),
    };

    await GoogleSignin.configure({
      ...configPlatform,
      webClientId: '',
      offlineAccess: false,
    });
  }

  async googleGetCurrentUser() {
    try {
      const user = await GoogleSignin.currentUserAsync();
      this.setState({ user, error: null });
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  checkuserExists = async ()=>{
    const user = await AsyncStorage.getItem('data');
    const interest = await AsyncStorage.getItem('interest');
    this.setState({loading : false});
    if(user!= null){
      if(interest === '0'){
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'InterestSelectionScreen' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      } else {
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      }
    }
  }

  signIn = async (data)=>{
    this.setState({error_text : null});
    axios.post('https://mycampusdock.com/auth/signin', {email : data.email, token : data.idToken}).then(async (response) =>{
      this.props.login_success(data, response.data.token);
      this.setState({loading : false});
      if(response.data.newUser){
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'CreateProfileScreen' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      } else {
        await this.update(JSON.stringify(response.data));
        if(response.data.data.interests === undefined){
          await AsyncStorage.setItem('interest', '0');
          const actionToDispatch = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'InterestSelectionScreen', })],
          });
          this.props.navigation.dispatch(actionToDispatch);
        } else {
          await AsyncStorage.setItem('interest', '1');
          const actionToDispatch = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Main', })],
          });
          this.props.navigation.dispatch(actionToDispatch);
        }
      }
    }).catch((err)=>{
      console.log(err);
      this.setState({error_text : 'Check your Internet!'});
    });
  }

  update = async (data) =>{
    await AsyncStorage.setItem('data', data);
  }

  googleSignIn = async () => {
    this.setState({loading : true});
    try {
      const user = await GoogleSignin.signIn();
      this.signIn(user);
    } catch (error) {
      if (error.code === 'CANCELED') {
        error.message = 'user canceled the login flow';
      }
    }
    this.setState({
      loading: false 
    });
  };

  googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  handleFbLogin = (error, result) =>{
    if (error) {
      console.log(error);
    } else {
      try {
        this.signIn(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  logout = () =>{
    this.googleSignOut();
  }

  loading = (loading) => {
    this.setState({loading});
  }

  render() {
    return(
      <LinearGradient colors={['rgb(31, 31, 92)', 'rgb(73, 166, 232)']} 
        style={styles.mainContainer}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"/>
        <View style={{flex : 3}}>
          <Text style = {styles.title}>{'It\'s always about You!'}</Text>
          <View style={styles.icon_container}>
            <View style={styles.icon}>
              <Icon_student />
            </View>
            <View style={styles.icon}>
              <Icon_inst />
            </View>
            <View style={styles.icon}>
              <Logo_white />
            </View>
            <View style={styles.icon}>
              <Icon_trophy />
            </View>
            <View style={styles.icon}>
              <Icon_book />
            </View>
          </View>
          <Text style = {styles.slogan}>Knowledge is power, Information is liberating.</Text>
          <ActivityIndicator size="large" color="#00ff00" animating={this.state.loading}/>
          <Text style = {styles.error_style}>{this.state.error_text}</Text>
        </View>
        <View style = {styles.action_container}>
          <Text style={styles.welcome}>Welcome to Dock</Text>
          <Text style={styles.hint}>Tap button below for One-Tap-Login</Text>
          <TouchableOpacity 
            disabled = {this.state.loading}
            style={styles._button} 
            onPress={this.googleSignIn}>
            <Image
              style = {{ marginLeft : 10, width: 32, height: 32, tintColor : '#fff'}}
              source={require('./images/google.png')}/>
            <Text style={styles.btn_style}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>);
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  icon_container : {
    justifyContent:'center', 
    alignItems: 'center', 
    marginTop: 40,
    flexDirection : 'row'
  },
  icon:{
    marginLeft:10,
    marginRight:10
  },
  title :{
    color : '#ffffff',
    marginTop : 80,
    textAlign : 'center',
    fontWeight : Platform.OS === 'android'?'200' : '300',
    fontSize: 32 
  },
  slogan :{
    color : '#ffffff',
    justifyContent :'center',
    alignItems : 'center',
    textAlign : 'center',
    marginTop : 25,
    marginBottom : 25,
    fontSize: 15
  },
  _button : {
    height: 50,
    borderRadius : 30,
    alignItems : 'center',
    flexDirection : 'row',
    backgroundColor : '#3f3f76',
    width : '100%',
  },
  action_container : {
    paddingTop : 20,
    flex : 1, 
    width: '100%',
    borderTopLeftRadius : 12, 
    borderTopRightRadius : 12,
    elevation : 8,
    shadowOpacity : 0.5, 
    shadowOffset : {width : 1, height : 1},
    backgroundColor : '#eee',
    paddingLeft : 40,
    paddingRight: 40
  },
  btn_style: {
    fontSize : 18,
    color : '#fff',
    textAlign : 'center',
    flex : 1,
  },
  welcome : {
    fontSize : 25,
    marginBottom : 10,
    textAlign : 'center'
  },
  hint : {
    fontSize : 12,
    color : 'grey',
    marginBottom : 20,
    textAlign : 'center'
  },
  error_style : {
    fontSize : 15,
    color : 'red',
    textAlign : 'center'
  }
});

Login.propTypes = {
  login_success: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login_success: (payload, token) => {
      dispatch({ type: AUTH_USER, payload, token });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);