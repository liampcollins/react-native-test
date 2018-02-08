import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import createDrawer from './screens/Drawer';
import { isSignedIn } from './aws/auth';

export default class App extends Component {
  constructor() {
    super();
    this.state = { ready: false };
  }

  componentDidMount() {
    isSignedIn((err, result) => {
      this.setState({ signedIn: result, ready: true });
    });
  }

  renderWaiting() {
    return null;
  }

  renderApplication() {
    const Drawer = createDrawer(this.state.signedIn);
    return (
      <Provider store={store}>
        <Drawer />
      </Provider>
    );
  }

  render() {
    if (this.state.ready) {
      return this.renderApplication();
    }
    return this.renderWaiting();
  }
}
