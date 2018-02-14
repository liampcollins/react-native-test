import React from 'react';
import {
  Image,
  Text,
  View
} from 'react-native';
import {
  Button,
  Card,
  FormInput,
  FormLabel,
  FormValidationMessage
} from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { onVerify } from '../../aws/auth';

class VerifyView extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      email: props.navigation.state.params,
      emailValidationError: '',
      code: '',
      codeValidationError: '',
      error: '',
      loading: false
    };
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
      this.setState({ email: value.toLowerCase() }, () => {
        setValidate();
      });
    }

    if (name === 'code') {
      this.setState({ code: value }, () => {
        setValidate();
      });
    }
  }

  getButtonState() {
    if (
      this.state.emailValidationError ||
      this.state.codeValidationError ||
      this.state.email.length === 0 ||
      this.state.code.length === 0 ||
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

  goToSignIn() {
    const action = {
      type: 'Navigation/RESET',
      index: 0,
      actions: [{ type: 'Navigate', routeName: 'SignIn' }]
    };
    this.props.navigation.dispatch(action);
  }

  verifyUser() {
    onVerify(this.state.email, this.state.code, err => {
      if (err) {
        this.setState({ loading: false, error: err.message }, () => {
          this.render();
        });
      } else {
        const action = {
          type: 'Navigation/RESET',
          index: 0,
          actions: [
            {
              type: 'Navigate',
              routeName: 'SignIn',
              params: this.state.email
            }
          ]
        };
        this.props.navigation.dispatch(action);
      }
    });
  }

  render() {
    const { confirmationMessageStyle, errorMsgStyle } = styles;
    return (
      <KeyboardAwareScrollView style={{ paddingVertical: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/icons/app-icon.png')}
            style={{ width: 75, height: 75 }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={confirmationMessageStyle}
          >
            An email has been sent to you containing your confirmation code.
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          {this.getErrorDisplay() && (
            <Text
              style={errorMsgStyle}
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
          <FormLabel>Code</FormLabel>
          <FormInput
            secureTextEntry
            placeholder="Code..."
            value={this.state.code}
            onChangeText={text => this.setFieldState('code', text)}
          />
          <FormValidationMessage>
            {this.state.codeValidationError}
          </FormValidationMessage>

          <Button
            disabled={!this.getButtonState()}
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Verify"
            loading={this.state.loading}
            onPress={() => this.verifyUser()}
          />
          <Button
            buttonStyle={{ marginTop: 25 }}
            backgroundColor="transparent"
            textStyle={{ color: '#03A9F4' }}
            title="Sign In"
            onPress={() => this.goToSignIn()}
          />
        </Card>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  confirmationMessageStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    fontSize: 16
  },
  errorMsgStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold'
  }
};
export default VerifyView;
