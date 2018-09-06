import React, { Component } from 'react';
import { Text, Form, Item, Input, Icon } from 'native-base';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BUNDLE_DETAILS } from '../constants';

class ContactDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.update_bundle_state = this.update_bundle_state.bind(this);
  }
  state = {
    c1_name: '',
    c1_phone: '',
    c2_name: '',
    c2_phone: '',
    faq: ''
  }
  componentDidMount() {
    this.update_bundle_state();
    this.props.isScreenValid(true);
  }
  update_bundle_state = () => {
    this.props.update_bundle({
      c1_name: this.state.c1_name,
      c1_phone: this.state.c1_phone,
      c2_name: this.state.c2_name,
      c2_phone: this.state.c2_phone,
      faq: this.state.faq
    });
  }
  set_c1_name = (c1_name) => {
    this.setState({ c1_name }, () => this.update_bundle_state());
  }
  set_c1_phone = (c1_phone) => {
    this.setState({ c1_phone }, () => this.update_bundle_state());
  }
  set_c2_name = (c2_name) => {
    this.setState({ c2_name }, () => this.update_bundle_state());
  }
  set_c2_phone = (c2_phone) => {
    this.setState({ c2_phone }, () => this.update_bundle_state());
  }
  setFaq = (faq) => {
    this.setState({ faq }, () => this.update_bundle_state());
  }
  render() {
    
    return(
      <Form style = {{ marginRight : 10, marginLeft : 10}}>
        <Item>
          <Icon active name='person' />
          <Input
            border
            placeholder="Full Name"
            value={this.state.c1_name}
            onChangeText={this.set_c1_name}
          />
        </Item>
        <Item>
          <Icon active name='call' />
          <Input
            border
            placeholder="Phone Number"
            keyboardType='phone-pad'
            value={this.state.c1_phone}
            onChangeText={this.set_c1_phone}
          />
        </Item>
        <Text style={{ fontWeight: '300', fontSize: 12, margin: 5 }}> Coordinator 1 Details </Text>
        <Item>
          <Icon active name='person' />
          <Input
            border
            placeholder="Full Name"
            value={this.state.c2_name}
            onChangeText={this.set_c2_name}
          />
        </Item>
        <Item>
          <Icon active name='call' />
          <Input
            border
            placeholder="Phone Number"
            keyboardType='phone-pad'
            value={this.state.c2_phone}
            onChangeText={this.set_c2_phone}
          />
        </Item>
        <Text style={{ fontWeight: '300', fontSize: 12, margin: 5 }}> Coordinator 2 Details </Text>
        <Item last style={{ marginTop: 15 }}>
          <Input 
            border
            placeholder="Frequently asked questions ?" 
            multiline={true}
            style={{minHeight: 150}}
            maxLength={2000}
            value={this.state.faq}
            onChangeText={this.setFaq}
          />
        </Item>
        <Text style={{ fontWeight: '300', fontSize: 12, margin: 5 }}> Explain any special things that audience should consider </Text>
      </Form>
    );
  }
}

ContactDetailsScreen.propTypes = {
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
      dispatch({ type: BUNDLE_DETAILS, payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetailsScreen);