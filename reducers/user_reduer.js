import { USER_LOGGED_IN } from '../actions/types';

const INITIAL_STATE = {
  email: ''
};

export default (state = INITIAL_STATE, action) => {
  console.log('USER_LOGGED_IN', action);
  switch (action.type) {
    case USER_LOGGED_IN: 
      return { email: action.payload };
    default:
      return state;
  }
};
