import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import SignInView from './SignInView';

class SignOutView extends SignInView {
  static navigationOptions = ({ navigation }) => ({
    drawerIcon: ({ tintColor, focused }) => (
      <FAIcon name={'sign-out'} size={20} color={tintColor} />
    )
  });

  constructor(props) {
    props.signout = true;
    super(props);
  }
}

export default SignOutView;
