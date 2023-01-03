import React, { PureComponent } from 'react';
import {
  View,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import AppRoute from "./src/navigation/navigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/Store";

class UserInactivity extends PureComponent {
  static propTypes = {
    timeForInactivity: PropTypes.number,
    checkInterval: PropTypes.number,
    children: PropTypes.node.isRequired,
    onAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeForInactivity: 10000,
    checkInterval: 2000,
    style: {
      flex: 1,
    },
  };

  state = {
    active: true,
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({ 
      onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
      onStartShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
      onResponderTerminationRequest: this.handleInactivity
    });
    this.handleInactivity();
  }

  componentWillUnmount() {
    clearInterval(this.inactivityTimer);
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */
  handleInactivity = () => {
    clearTimeout(this.timeout);
    this.setState({
      active: true,
    }, () => {
      this.props.onAction(this.state.active); // true
    });
    this.resetTimeout();
  }

  /**
   * If more than `this.props.timeForInactivity` milliseconds have passed
   * from the latest touch event, then the current state is set to `inactive`
   * and the `this.props.onInactivity` callback is dispatched.
   */
  timeoutHandler = () => {
    this.setState({
      active: false,
    }, () => {
      this.props.onAction(this.state.active); // false
    });
  }

  resetTimeout = () => {
    this.timeout = setTimeout(this.timeoutHandler, this.props.timeForInactivity);
  }

  onMoveShouldSetPanResponderCapture = () => {
    this.handleInactivity();
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    return false;
  }

  render() {
    const {
      style,
      children,
    } = this.props;
    return (
      <View
        style={style}
        collapsable={false}
        {...this.panResponder.panHandlers}
      >
   {children}
      </View>
    );
  }
}

export default class App extends PureComponent {
  state = {
    active: true,
    text: ''
  };

  onAction = (active) => {
    this.setState({
      active,
    });
  }

  render() {
    const { active } = this.state;
    console.log("adasd",active);
    return (
      <UserInactivity
        timeForInactivity={2000}
        checkInterval={1000}
        onAction={this.onAction}
      >      
      <Provider store={store}>
      <AppRoute />
      </Provider>
      </UserInactivity>
    );
  }
}