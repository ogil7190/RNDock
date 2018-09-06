import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { Form, Button, Text, Item, Picker } from 'native-base';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import { TagSelect } from 'react-native-tag-select';
import { BUNDLE_MEDIA } from '../constants';
import Axios from 'axios';
class MediaSelectionScreen extends Component {
  constructor(props) {
    super(props);
  }
  categories = {
    'Technology':['Computer Sceine', 'Machine Learning', 'Electronics', 'IOT', 'Mechanics', 'Data Sceince', 'BioTech'], 
    'Sports':['Cricket', 'Football', 'Basket Ball', 'Volley Ball', 'Tennis', 'Table Tenis', 'Indoor', 'Outdoor', 'Computer Games'],
    'Science':['Biology', 'Neurology', 'Life Sciences'],
    'Music':['Hip-hop', 'Jazz', 'Rock', 'Classical', 'Bollywood', 'Western'], 
    'Dance':['Classical', 'Bollywood', 'Free Style'], 
    'Drama':['Acting'], 
    'Art & Craft':['Calligraphy', 'Painting', 'Collage Making', 'Wall Painting', 'Graffiti'],
    'Photography':['Nature', 'Fashion', 'Abstract'],
    'Celebration':[],
    'Festival':[]
  }

  state = {
    imageFile: null,
    category: 'Technology',
    tags: {}
  }

  categoryPicker = (category) => {
    this.setState({ category, tags: {} }, () => this.isValid());
  }

  componentDidMount() {
    this.props.isScreenValid(false);
  }

  tagPress = (selectedTag) => {
    if( this.state.tags[selectedTag.id] !== undefined ) {
      const newTags = this.state.tags;
      delete newTags[selectedTag.id];
      this.setState({ tags: newTags }, () => this.isValid());
    } else {
      const newTags = this.state.tags;
      newTags[selectedTag.id] = selectedTag.label;
      this.setState({ tags: newTags }, () => this.isValid());
    }
  }

  isValid = () => {
    if(this.state.imageFile !== null){
      this.props.update_bundle({ 
        eventFile: { data: this.state.imageFile.data, type: 'image/jpeg', name: 'poster' },
        category: this.state.category,
        tags: this.state.tags
      });
      this.props.isScreenValid(true);
    } else {
      this.props.isScreenValid(false);
    }
  }

  handleUpload = () => {
    var options = {
      title: 'Select a poster',
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
        let source = { uri: response.uri };
        console.log(response);
        this.setState({
          imageFile: source
        }, ()=>this.isValid());
      }
    });
  }

  getDataForCategory = () =>{
    const arr = this.categories[this.state.category];
    let data = [];
    for(var i=0; i<arr.length; i++){
      data.push({id:i+1, label:arr[i]});
    }
    console.log(data);
    return data;
  }

  render() {
    const categories = this.categories;
    return(
      <Form style = {{ marginRight : 10, marginLeft : 10}}>
        <Image style={{ marginTop: 10, borderWidth: 1, borderColor: '#a3a3a3', borderRadius: 6, flex: 1, width: '100%', height: 200, resizeMode: 'cover' }} source={ this.state.imageFile === null ? require('../images/placeholder.jpg') : this.state.imageFile } />
        <Button
          bordered
          primary
          style={{ marginTop: 10, justifyContent: 'center', flex: 1, alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}
          onPress={this.handleUpload}
        >
          <Text>
            Pick an image
          </Text>
        </Button>
        <Text style={{ marginLeft: 10,  marginTop: 10, color : 'grey', fontWeight: '300', fontSize: 15 }}>
          Select a Category
        </Text>
        <Item picker last>
          <Picker
            mode="dropdown"
            placeholder="Category"
            textStyle={{ color: '#5cb85c' }}
            placeholderStyle={{ color: '#007aff' }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.category}
            onValueChange={this.categoryPicker.bind(this)} >
            {
              Object.keys(categories).map( (val, num) => <Picker.Item key={num} label={val} value={val} /> )
            }
          </Picker>
        </Item>
        <View style={{ marginTop: 20 }}>
          <TagSelect
            onItemPress={this.tagPress}
            data={this.getDataForCategory()}
          />
        </View>
        
      </Form>
    );
  }
}

MediaSelectionScreen.propTypes = {
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
      dispatch({ type: BUNDLE_MEDIA, payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelectionScreen);