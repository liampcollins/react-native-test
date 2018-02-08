import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SignInView from './components/authentication/SignInView';
import RegisterView from './components/authentication/RegisterView';
import VerifyView from './components/authentication/VerifyView';
import ResetPasswordView from './components/authentication/ResetPasswordView';
import ChangePasswordView from './components/authentication/ChangePasswordView';
import HomeView from './screens/HomeView';

const createRootNavigator = signedIn => {
  StatusBar.setBarStyle('dark-content');

  return StackNavigator(
    {
      SignIn: {
        screen: SignInView
      },
      Register: {
        screen: RegisterView
      },
      Verify: {
        screen: VerifyView
      },
      Reset: {
        screen: ResetPasswordView
      },
      ChangePassword: {
        screen: ChangePasswordView
      },
      Home: {
        screen: HomeView
      }
    },
    {
      headerMode: 'screen',
      initialRouteName: signedIn ? 'Home' : 'SignIn'
    }
  );
};

export default createRootNavigator;
