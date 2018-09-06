import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, Item, Form, Right, Switch, Left, Button, Icon, Input, Row } from 'native-base';
import PropTypes from 'prop-types';
import { BUNDLE_PAYMENTS } from '../constants';
class PaymentInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.isValid = this.isValid.bind(this);
  }

  state = {
    paid: false,
    price : 0,
    seats : 0
  }

  isValid = () => {
    if( !( isNaN(this.state.price) || isNaN(this.state.seats) )  ) {
      this.props.update_bundle({ 
        price: this.state.price,
        seats: this.state.seats
      });
      this.props.isScreenValid(true);
    } else {
      this.props.isScreenValid(false);
    }

  }

  handlePrice = (price) =>{
    this.setState({price}, () => this.isValid());
  }

  handleSeats = (seats) =>{
    this.setState({seats}, () => this.isValid());
  }

  componentDidMount() {
    this.props.isScreenValid(false);
  }
  render() {
    return(
      <Form>
        <Text style= {{marginTop: 20, flex:1, textAlign:'center'}}>You are almost ready to sail!</Text>
        <Item style={{marginTop:30, padding:10}}>
          <Left>
            <Text style={{ flex : 1, fontWeight:'500', color:'#a3a3a3'}}>Is this event Paid?</Text>
          </Left>
          <Right>
            <Switch value = {this.state.paid} onValueChange={(paid)=> this.setState({paid})} />
          </Right>
        </Item>
        {
          this.state.paid && 
          <Item>
            <Icon name = "cash" />
            <Input keyboardType="numeric" onChangeText = { (price) =>this.handlePrice(price)} placeholder = "Price per Head"/>
          </Item>
        }

        <Item>
          <Icon name = "beer" />
          <Input keyboardType="numeric" onChangeText = { (seats) =>this.handleSeats(seats)} placeholder ="No. of Seats Avialable"/>
        </Item>

        <Row style={{ marginTop: 20 }}>
          <Button disabled style={{flex: 1, padding: 10, marginLeft : 20, marginRight:20 }} iconLeft iconRight transparent Dark bordered>
            <Icon name='megaphone' />
            <Text>Promotion- Coming Soon!</Text>
            <Icon name='arrow-forward' />
          </Button>
        </Row>

        <Text style={{color : '#a3a3a3', marginTop: 20, marginLeft : 20, flex:1,}}>
          {'You can organize a Free or a Paid Event.\nYou can collect money anytime in a linked bank account within 24 hrs.'}
        </Text>
      </Form>
    );
  }
}

PaymentInfoScreen.propTypes = {
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
      dispatch({ type: BUNDLE_PAYMENTS, payload });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoScreen);