import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { connect } from 'react-redux';
import FAIcon from 'react-native-vector-icons/FontAwesome';

class HomeView extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;

    return {
      title: 'Home',
      headerLeft: (
        <TouchableHighlight
          style={{ paddingLeft: 10, width: 60, height: 30 }}
          underlayColor="transparent"
          onPress={() => {
            navigation.state.params.burger();
          }}
        >
          <FAIcon name={'bars'} size={20} />
        </TouchableHighlight>
      ),
      drawerIcon: ({ tintColor, focused }) => (
        <FAIcon name={'list'} size={20} color={tintColor} />
      )
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setParams({ burger: this.onBurger.bind(this) });
  }

  render() {
    console.log('PROPS', this.props);
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ paddingTop: 50 }}>HOMEPAGE!</Text>
      </View>
    );
  }

  onBurger() {
    this.props.navigation.navigate('DrawerOpen');
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps, {})(HomeView);
