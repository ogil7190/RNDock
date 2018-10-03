import React, { Component } from 'react';
import {View, Text, FlatList, StatusBar, AsyncStorage, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import InterestCard from './components/InterestCard';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';

const interests = [
  { name : 'Technology', source : 'https://www.training.com.au/wp-content/uploads/career-in-technology-feature.png' },
  { name : 'Coding', source : 'https://cdn-images-1.medium.com/max/1600/1*iFN_PWPWs6TQ9JzDp2v9Wg.jpeg' },
  { name : 'Entertainment', source : 'https://s.hdnux.com/photos/13/55/35/3069806/3/core_multimedia_package.jpg' },
  { name : 'Fashion', source : 'https://files.fashiontv.com/wp-content/uploads/2017/09/ftv-paris-horisontal-big-2048x1152.jpg' },
  { name : 'Sports', source : 'https://s3-us-west-2.amazonaws.com/sportshub2-uploads-prod/files/sites/1123/2016/12/24181512/8c6159d7e20da347-sports.jpg'},
  { name : 'Science', source : 'https://qph.fs.quoracdn.net/main-qimg-edcc47cecfa5316ffee6ee1ce5143517' },
  { name : 'Literature', source : 'https://i1.wp.com/www.timesofyouth.com/wp-content/uploads/2018/07/literature.jpg?fit=585%2C310&ssl=1'},
  { name : 'Art & Craft', source : 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'},
  { name : 'Business', source : 'https://assets.entrepreneur.com/content/3x2/2000/20170420203636-GettyImages-494940062.jpeg?width=600'},
  { name : 'Politics', source : 'https://www.timeshighereducation.com/sites/default/files/styles/the_breaking_news_image_style/public/political_protest_illustration.jpg?itok=ZDJV-J8V'},
  {name : ' ', source : ' '}];

class InterestSelectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selections : [],
      error : '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  handlePress = (added, item) =>{
    if(item !== undefined){
      let mod_selections = this.state.selections;
      if(added){
        if(!mod_selections.includes(item.item.name))
          mod_selections.push(item.item.name);
      } else{
        let indx = mod_selections.indexOf(item.item.name);
        if(indx > -1){
          mod_selections.splice(indx, 1);
        }
      }
      this.setState({selections : mod_selections});
    }
  }

  handleSubmit = async () =>{
    if(this.state.selections.length >= 3){
      this.setState({error : ''});
      const str = await AsyncStorage.getItem('data');
      const data = JSON.parse(str);
      const token = data.token;
      const response = await axios.post('https://mycampusdock.com/auth/user/update-interest', { interests : this.state.selections }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      console.log(response);
      if(!response.error){
        await this.saveInterests();
        const actionToDispatch = StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        });
        this.props.navigation.dispatch(actionToDispatch);
      }
    } else {
      this.setState({error : 'Select at least 3 interests'});
    }
  }

  saveInterests = async () =>{
    await AsyncStorage.setItem('interest', '1');
    const str = await AsyncStorage.getItem('data');
    let data = JSON.parse(str);
    data.data.interests = this.state.interests;
    await AsyncStorage.setItem('data', JSON.stringify(data));
  }

  unsaveUser = async ()=>{
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    StatusBar.setHidden(true);
    return(
      <View style={{flex : 1,}}>
        <View style = {{ backgroundColor : 'rgb(31, 31, 92)', height : Platform.OS === 'android' ? 70 : 65, paddingTop : Platform.OS === 'android'? 8 : 20, flex : 1}}>
          <View>
            <Text style={{margin : 15, fontSize : 25, color : '#fff', textAlign : 'center', fontWeight : '300'}} onPress={this.unsaveUser}>What would you like to hear about?</Text>
            <Text style={{ margin : 5, marginLeft : 20, marginRight :20, fontSize : 15, color : '#fff', textAlign : 'center', fontWeight : '300'}}>Pick the topics that interests you. Add more at any time.</Text>
            <Text style={{ margin : 5, marginLeft : 20, marginRight :20, fontSize : 15, color : 'yellow', textAlign : 'center', fontWeight : '300'}}>{this.state.error}</Text>
          </View>
          <FlatList
            style={{paddingRight : 10, paddingLeft : 10, paddingTop : 10, paddingBottom : 100}}
            keyExtractor={(item, index) => index.toString()}
            data={interests}
            numColumns = {2}
            renderItem={(item)=> <InterestCard data = {item} onPress={(added) => this.handlePress(added, item)}/>} /> 

          <TouchableOpacity disabled = {this.state.loading} style={{ justifyContent: 'center', alignItems : 'center',  marginTop : 20, padding : 10, position : 'absolute', alignSelf : 'center', bottom : 15}} onPress={this.handleSubmit}>
            <View style={{flexDirection : 'row', backgroundColor: '#3f3f76', borderRadius :30, padding: 5}}>
              <Text style={{color:'#fff', paddingLeft : 30, paddingRight : 30, padding : 5,  fontSize : 20,  textAlign : 'center', textAlignVertical : 'center'}}>
                {'Finish with ' + this.state.selections.length + ' interests'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

InterestSelectionScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default InterestSelectionScreen;