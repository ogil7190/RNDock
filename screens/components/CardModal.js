import React, {Component} from 'react';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

class CardModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pressedStyle: {},

      org_width: width - 32,
      org_height: height / 5,

      top_width: new Animated.Value(width - 32),
      top_height: new Animated.Value(height / 2),
      bottom_width: new Animated.Value(width - 32),
      bottom_height: new Animated.Value(height / 12),
      content_height: new Animated.Value(0),

      top_pan: new Animated.ValueXY(),
      bottom_pan: new Animated.ValueXY(),
      content_pan: new Animated.ValueXY(),

      content_opac: new Animated.Value(0),
      button_opac: new Animated.Value(0),
      back_opac: new Animated.Value(0),
      plus: new Animated.Value(1),

      TopBorderRadius: 12,
      BottomBorderRadius: 0,

      activate: 'Activate',
      activated: false,

      offset: 0,
      pressed: false,
    };

    this._onPress = this._onPress.bind(this);
    this.calculateOffset = this.calculateOffset.bind(this);
    this.activate = this.activate.bind(this);

  }
  card = '';

  _onPress() {
    this.props.onPress(this.card, this.props.data);
    if(this.props.tapped){
      this.setState({pressed: !this.state.pressed});
      this.calculateOffset();
    }
  }

  componentDidMount(){
    if(this.props.tapped){
      setTimeout(()=>{
        this._onPress();
      }, 100);
    }
  }


  grow() {
    this.setState({TopBorderRadius: 0, BottomBorderRadius: 5});
    Animated.parallel([
      Animated.spring(
        this.state.top_width,
        {
          toValue: width
        }
      ).start(),
      Animated.spring(
        this.state.top_height,
        {
          toValue: height/2
        }
      ).start(),
      Animated.spring(
        this.state.bottom_height,
        {
          toValue: height/6 + 50
        }
      ).start(),
      Animated.spring(
        this.state.content_height,
        {
          toValue: height/2
        }
      ).start(),
      Animated.spring(
        this.state.top_pan,
        {
          toValue: {
            x: 0,
            y: -this.state.offset
          }
        }
      ).start(),
      Animated.spring(
        this.state.content_pan,
        {
          toValue: {
            x: 0,
            y: -(height/8  + this.state.offset)
          }
        }
      ).start(),
      Animated.spring(
        this.state.bottom_pan,
        {
          toValue: {
            x: 0,
            y: -(50 + this.state.offset)
          }
        }
      ).start(),

      Animated.timing(
        this.state.content_opac,
        {
          toValue: 1
        }
      ).start(),
      Animated.timing(
        this.state.button_opac,
        {
          toValue: 1
        }
      ).start(),
      Animated.timing(
        this.state.back_opac,
        {
          toValue: 1
        }
      ).start(),
      Animated.timing(
        this.state.plus,
        {
          toValue: 0
        }
      ).start(),

    ]);
  }

  shrink() {
    this.setState({TopBorderRadius: 5, BottomBorderRadius: 0});
    Animated.parallel([
      Animated.spring(
        this.state.top_width,
        {
          toValue: this.state.org_width
        }
      ).start(),
      Animated.spring(
        this.state.top_height,
        {
          toValue: this.state.org_height
        }
      ).start(),
      Animated.spring(
        this.state.bottom_height,
        {
          toValue: height/6
        }
      ).start(),
      Animated.spring(
        this.state.top_pan,
        {
          toValue: {
            x: 0,
            y: 0
          }
        }
      ).start(),
      Animated.spring(
        this.state.bottom_pan,
        {
          toValue: {
            x: 0,
            y: 0
          }
        }
      ).start(),
      Animated.spring(
        this.state.content_height,
        {
          toValue: 0
        }
      ).start(),
      Animated.timing(
        this.state.content_opac,
        {
          toValue: 0
        }
      ).start(),
      Animated.timing(
        this.state.button_opac,
        {
          toValue: 0
        }
      ).start(),
      Animated.timing(
        this.state.back_opac,
        {
          toValue: 0
        }
      ).start(),
      Animated.timing(
        this.state.plus,
        {
          toValue: 1
        }
      ).start(),

    ]);
  }

  cont = '';

  calculateOffset() {
    if(this.cont) {
      this.cont.measure((fx, fy, width, height, px, py) => {
        this.setState({offset: py}, () => {
          if(this.state.pressed) {
            console.log('growing with offset', this.state.offset);
            this.grow();
          } else {
            console.log('shrinking with offset', this.state.offset);
            this.shrink();
          }
        });
      });
    }
  }

  activate() {
    this.setState({activate: 'loading'});
    setTimeout(()=> {
      this.setState({activate: <Text>Activated  <Icon name='checkmark'/></Text>, activated: true});
    }, 1500);

  }


  renderTop() {
    var borderStyles = !this.state.pressed ? {borderRadius: this.state.TopBorderRadius, borderBottomLeftRadius: 0} :
      {borderTopRightRadius: this.state.TopBorderRadius, borderTopLeftRadius: this.state.TopBorderRadius};
    return (
      <Animated.View
        style={[styles.top, borderStyles, {
          width: this.state.top_width,
          height: this.state.top_height,
          transform: this.state.top_pan.getTranslateTransform()
        }]}>
        <FastImage
          style = {{flex : 1, borderTopLeftRadius : 12, borderTopRightRadius : 12}}
          source={{
            uri : this.props.image,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </Animated.View>
    );
  }

  renderBottom() {
    var loading = this.state.activate == 'loading' ?
      <ActivityIndicator animating={true} color='white'/>
      :<Text style={{color: 'white', fontWeight: '800', fontSize: 18}}>{this.state.activate}</Text>;

    var button = this.state.pressed
      ?
      <TouchableOpacity onPress={this.activate}>
        <Animated.View style={{opacity: this.state.button_opac, backgroundColor: this.props.color,
          marginTop: 10, borderRadius: 10, width: width-64, height: 50,
          alignItems: 'center', justifyContent: 'center'}}>
          {loading}
        </Animated.View>

      </TouchableOpacity>
      :
      null;

    // var plusButton = !this.state.activated
    //   ?
    //   <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
    //     <Icon name='add-circle' style={{fontSize: 24, color: this.props.color}}/>
    //   </Animated.View>
    //   :
    //   <Animated.View style={{opacity: this.state.plus, justifyContent: 'center', alignItems: 'center'}}>
    //     <Icon name='checkmark-circle' style={{fontSize: 24, color: this.props.color}}/>
    //   </Animated.View>;

    return (
      <Animated.View style={[styles.bottom,
        {
          backgroundColor : 'white',
          width: this.state.bottom_width,
          height: this.state.bottom_height,
          borderRadius: this.state.BottomBorderRadius,
          transform: this.state.bottom_pan.getTranslateTransform()
        }]}>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 12}}>{this.props.data.title}</Text>
            {/* <Text style={{fontSize: 12, fontWeight: '500', color: 'gray', paddingBottom: 10}}>{'I have something'}</Text> */}
            {/* <Text style={{fontSize: 12, fontWeight: '500', color: 'gray'}}>Ends in {this.props.due} days</Text> */}
          </View>

          {/* {plusButton} */}

        </View>
        {/* {button} */}
      </Animated.View>
    );
  }

  renderContent() {
    if(!this.state.pressed) {
      return;
    }
    return (
      <Animated.View style={{opacity: this.state.content_opac, marginTop: 40, width: width, height: this.state.content_height, zIndex: -1,
        backgroundColor: '#ddd', transform: this.state.content_pan.getTranslateTransform()}}>
        <View style={{backgroundColor: 'white', flex: 1, margin: 16, padding: 16}}>
          <Text style={{fontSize: 24, fontWeight: '700', color: 'black'}}>Description</Text>
          <Text style={{color: 'gray', paddingTop: 10}}>{this.props.data.location}</Text>
        </View>
      </Animated.View>
    );
  }

  render() {
    return (
      <View ref={(viewRef) => this.card = viewRef} style={[styles.container, this.state.pressedStyle]}>
        <TouchableWithoutFeedback
          onPress={!this.state.pressed ? this._onPress : null}>
          <View ref={(vrf) => this.cont = vrf}
            style={[{alignItems: 'center'}]}>
            {this.renderTop()}
            {this.renderBottom()}
            {this.renderContent()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor : 'white',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius : 12,
    marginTop: 16,
  },
  top: {
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius : 12
  },
  bottom: {
    marginTop: 0,
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'white'
  },
  backButton: {
    backgroundColor: 'white',
    top: 32,
    left: 10,
  }
});

CardModal.propTypes = {
  data : PropTypes.object.isRequired,
  color : PropTypes.string.isRequired,
  image : PropTypes.string.isRequired,
  due : PropTypes.number.isRequired,
  onPress : PropTypes.func.isRequired,
  tapped : PropTypes.bool.isRequired
};

export default CardModal;