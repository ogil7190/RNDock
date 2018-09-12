import React, { Component } from 'react';
import {StyleSheet, Platform, StatusBar, View, Image, AsyncStorage, ToastAndroid} from 'react-native';
import { Text, Button, Spinner } from 'native-base';
import { GoogleSignin } from 'react-native-google-signin';
import PropTypes from 'prop-types';
import { AUTH_USER } from '../constants';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icons from './icons';
//import { LoginManager, AccessToken, GraphRequest,GraphRequestManager } from 'react-native-fbsdk';
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
    //this.handleFbLogin = this.handleFbLogin.bind(this);
    //this.fbLogin = this.fbLogin.bind(this);
    //this.fetchData = this.fetchData.bind(this);
    this.loading = this.loading.bind(this);
    this.state = {
      user: null,
      error: null,
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
          iosClientId: '7449865696-ae0o9lcpdto2iq2jmq1dt52l9q3pikdp.apps.googleusercontent.com',
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
    this.setState({loading : false});
    if(user!= null){
      const actionToDispatch = StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      });
      this.props.navigation.dispatch(actionToDispatch);
    }
  }

  signIn = async (data)=>{
    ToastAndroid.show('We have:'+JSON.stringify(data), ToastAndroid.LONG);
    axios.post('https://mycampusdock.com/auth/signin', {email : data.email}).then((response) =>{
      this.setState({loading : false});
      this.props.login_success(data, response.data.token);
      if(response.data.newUser){
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'CreateProfileScreen' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      } else {
        this.update(JSON.stringify(response.data));
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      }
    });
  }

  update = async (data) =>{
    await AsyncStorage.setItem('data', data);
    console.log('Data updated : ', data);
  }

  googleSignIn = async () => {
    this.setState({loading : true});
    try {
      ToastAndroid.show('Error BEFORE', ToastAndroid.LONG);
      const user = await GoogleSignin.signIn();
      ToastAndroid.show('Error AFTER', ToastAndroid.LONG);
      this.signIn(user);
    } catch (error) {
      ToastAndroid.show('Error :'+error, ToastAndroid.LONG);
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
      console.log('Logged out!');
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

  // fetchData = () =>{
  //   const handleFbLogin = this.handleFbLogin;
  //   AccessToken.getCurrentAccessToken().then(
  //     (data) => {
  //       let accessToken = data.accessToken;
  //       const infoRequest = new GraphRequest(
  //         '/me',
  //         {
  //           accessToken: accessToken,
  //           parameters: {
  //             fields: {
  //               string: 'email,name,first_name,middle_name,last_name,picture.width(720).height(720)'
  //             }
  //           }
  //         },
  //         handleFbLogin
  //       );
  //       new GraphRequestManager().addRequest(infoRequest).start();
  //     }
  //   );
  // }

  logout = () =>{
    this.googleSignOut();
  }

  loading = (loading) => {
    this.setState({loading});
  }

  // fbLogin = () =>{
  //   const fetchData = this.fetchData;
  //   this.setState({ loading: true });
  //   const loading = this.loading;
  //   LoginManager.logInWithReadPermissions(['public_profile', 'email'])
  //     .then(
  //       function (result) {
  //         if (result.isCancelled) {
  //           console.log('Login cancelled');
  //           loading(false);
  //         } else {
  //           fetchData();
  //         }
  //       }, 
  //       function (error) {
  //         console.log('Login fail with error: ' + error);
  //         this.setState({ loading: false });
  //       }
  //     );
  // }

  render() {
    return(
      <LinearGradient colors={['rgb(31, 31, 92)', 'rgb(73, 166, 232)']} 
        style={styles.mainContainer}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"/>
        <Text style = {styles.title}>Hi there,{'\n'}Welcome to Dock!</Text>
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
        <View style = {styles.action_container}>
          <Button 
            light 
            disabled = {this.state.loading}
            style={styles._button} 
            onPress={this.googleSignIn}>
            <Image
              style = {{ marginLeft : 10, width: 32, height: 32}}
              source={require('./images/google.png')}/>
            <Text style={styles.btn_style}>Continue with Google</Text>
          </Button>
        </View>
        <Text 
          style={styles.help_text}>
          Need Any Help?
        </Text>
        <Spinner animating={this.state.loading}/>
      </LinearGradient>);
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  icon_container : {
    justifyContent:'center', 
    alignItems: 'center', 
    marginTop: 30, 
    flexDirection : 'row'
  },
  icon:{
    marginLeft:10, 
    marginRight:10
  },
  title :{
    color : '#ffffff',
    marginTop : 60,
    fontSize: 30 
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
  help_text :{
    color : '#dfdfdf',
    justifyContent :'center',
    alignItems : 'center',
    textAlign : 'center',
    marginTop : 10,
    fontSize: 15
  },
  _button : {
    height: 50,
    width: '100%',
    borderRadius : 10,
  },
  action_container : {
    marginTop : 20,
    width: '100%',
    paddingLeft : 20,
    paddingRight: 20
  },
  btn_style: {
    flex: 1,
    paddingLeft : 30,
    paddingRight: 30
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