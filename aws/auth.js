import { AsyncStorage } from 'react-native';
import { util } from 'aws-sdk/dist/aws-sdk-react-native';
import {
  AWS_REGION,
  AWS_POOL_ID,
  AWS_POOL_CLIENT_ID
} from 'react-native-dotenv';
import utils from './utils';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from './aws-cognito-identity/index';

const AWS_COGNITO = {
  UserPoolId: AWS_POOL_ID,
  ClientId: AWS_POOL_CLIENT_ID
};

export const onSignIn = (userName, password, callback) => {
  const userPool = new CognitoUserPool(AWS_COGNITO);
  const authDetails = new AuthenticationDetails({
    Username: userName,
    Password: password
  });
  const cognitoUser = new CognitoUser({
    Username: userName,
    Pool: userPool
  });

  const start = new Date().getTime();
  cognitoUser.authenticateUser(authDetails, {
    onSuccess: result => {
      console.log('authenticateUser timey', new Date().getTime() - start);
      const jwt = parseJwt(result.getAccessToken().getJwtToken());
      utils.setEmailUserID(userName, jwt.sub, () => {
        callback(null);
      });
    },
    onFailure: err => {
      callback(err);
    }
  });
};

export const onRegister = (userName, password, callback) => {
  const userPool = new CognitoUserPool(AWS_COGNITO);
  const attributeList = [
    new CognitoUserAttribute({ Name: 'email', Value: userName })
  ];
  userPool.signUp(userName, password, attributeList, null, (err, result) => {
    if (err) {
      console.log('onRegister', err);
      callback(err);
    } else {
      console.log('onRegister', result);
      callback(null);
    }
  });
};

export const onVerify = (userName, code, callback) => {
  const userPool = new CognitoUserPool(AWS_COGNITO);
  const cognitoUser = new CognitoUser({
    Username: userName,
    Pool: userPool
  });

  cognitoUser.confirmRegistration(code, true, (err, result) => {
    if (err) {
      console.log('onVerify', err);
      callback(err);
    } else {
      console.log('onVerify', result);
      callback(null);
    }
  });
};

export const onReset = (userName, callback) => {
  const userPool = new CognitoUserPool(AWS_COGNITO);
  const cognitoUser = new CognitoUser({
    Username: userName,
    Pool: userPool
  });

  cognitoUser.forgotPassword({
    onSuccess(result) {
      console.log('onReset', result);
      callback(null);
    },
    onFailure(err) {
      console.log('onReset', err);
      callback(err);
    }
  });
};

export const onChangePassword = (userName, code, password, callback) => {
  const userPool = new CognitoUserPool(AWS_COGNITO);
  const cognitoUser = new CognitoUser({
    Username: userName,
    Pool: userPool
  });

  cognitoUser.confirmPassword(code, password, {
    onSuccess(result) {
      console.log('onChangePassword', result);
      callback(null);
    },
    onFailure(err) {
      console.log('onChangePassword', err);
      callback(err);
    }
  });
};

function parseJwt(token) {
  const payload = token.split('.')[1];
  return JSON.parse(util.base64.decode(payload).toString('utf8'));
}

export const isSignedIn = callback => {
  AsyncStorage.getItem('USER_ID', (err, result) => {
    callback(err, result);
  });
};
