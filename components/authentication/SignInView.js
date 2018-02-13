import React, { Component } from 'react';
import { Image, Text, View, KeyboardAvoidingView } from 'react-native';
import {
  Button,
  Card,
  FormInput,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { onSignIn } from '../../aws/auth';
import utils from '../../aws/utils';
import { userLoggedIn } from '../../actions';

export class SignInView extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      email: props.navigation.state.params ? props.navigation.state.params : '',
      emailValidationError: '',
      password: '',
      passwordValidationError: '',
      error: '',
      loading: false
    };

    if (props.signout) {
      console.log('props.logout', props.signout);
      utils.removeEmailUserID(() => {
        console.log('user credentials cleared');
      });
    }
  }

  setFieldState(name, value) {
    const setValidate = () => {
      const state = {};
      state[`${name}ValidationError`] = null;
      if (value === '') {
        state[`${name}ValidationError`] = 'Required';
        this.setState(state);
      } else {
        state[`${name}ValidationError`] = '';
        this.setState(state);
      }
    };

    if (name === 'email') {
      this.setState({ email: value.trim().toLowerCase() }, () => {
        setValidate();
      });
    }

    if (name === 'password') {
      this.setState({ password: value }, () => {
        setValidate();
      });
    }
  }

  getButtonState() {
    if (
      this.state.emailValidationError ||
      this.state.passwordValidationError ||
      this.state.email.length === 0 ||
      this.state.password.length === 0 ||
      this.state.loading
    ) {
      return false;
    }
    return true;
  }

  getErrorDisplay() {
    if (this.state.error) {
      return <Text>{this.state.error}</Text>;
    }
    return null;
  }

  signInUser() {
    this.setState({ loading: true }, () => {
      // This call to setTimeout is required to give the view time to render
      const signIn = this.props.userLoggedIn;
      setTimeout(() => {
        onSignIn(this.state.email, this.state.password, err => {
          if (err) {
            this.setState(
              { loading: false, error: err.message },
              () => {
                this.render();
              }
            );
          } else {
            signIn(this.state.email);
            this.props.navigation.navigate('Home');
          }
        });
      }, 50);
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ paddingVertical: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/icons/app-icon.png')}
            style={{ width: 75, height: 75 }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          {this.getErrorDisplay() && (
            <Text
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 30,
                color: 'red',
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              {this.getErrorDisplay()}
            </Text>
          )}
        </View>
        <Card>
          <FormLabel>Email</FormLabel>
          <FormInput
            placeholder="Email address..."
            value={this.state.email}
            onChangeText={text => this.setFieldState('email', text)}
          />
          <FormValidationMessage>
            {this.state.emailValidationError}
          </FormValidationMessage>
          <FormLabel>Password</FormLabel>
          <FormInput
            secureTextEntry
            placeholder="Password..."
            value={this.state.password}
            onChangeText={text => this.setFieldState('password', text)}
          />
          <FormValidationMessage>
            {this.state.passwordValidationError}
          </FormValidationMessage>

          <Button
            disabled={!this.getButtonState()}
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Sign In"
            loading={this.state.loading}
            onPress={() => this.signInUser()}
          />
          <Button
            buttonStyle={{ marginTop: 10 }}
            backgroundColor="transparent"
            textStyle={{ color: '#03A9F4' }}
            title="Register"
            onPress={() => {
              const action = {
                type: 'Navigation/RESET',
                index: 0,
                actions: [{ type: 'Navigate', routeName: 'Register' }]
              };
              this.props.navigation.dispatch(action);
            }}
          />
          <Button
            buttonStyle={{ marginTop: 0 }}
            backgroundColor="transparent"
            textStyle={{ color: '#03A9F4' }}
            title="Forgot Password"
            onPress={() => {
              const action = {
                type: 'Navigation/RESET',
                index: 0,
                actions: [{ type: 'Navigate', routeName: 'Reset' }]
              };
              this.props.navigation.dispatch(action);
            }}
          />
        </Card>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });
// export default SignInView;
export default connect(mapStateToProps, { userLoggedIn })(SignInView);
