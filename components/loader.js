import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '../styles';

type Props = {
  style: Object,
};

type State = {
  shouldAnimate: boolean,
  value: Animated.Value,
};

export default class Loader extends Component<*, Props, State> {
  state = {
    shouldAnimate: true,
    value: new Animated.Value(0),
  };

  componentDidMount = (): void => {
    this.runAnimation();
  };

  componentWillUnmount = (): void => {
    this.stopAnimation();
  };

  render = (): React.Element<*> => {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Animated.Image
          source={require('../assets/graphql-logo.png')}
          style={[styles.image, style, this.getAnimationStyles()]}
        />
      </View>
    );
  };

  runAnimation = (): void => {
    const { value } = this.state;
    value.setValue(0);

    Animated.timing(value, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.sin),
      useNativeDriver: true,
    }).start(() => {
      const { shouldAnimate } = this.state;
      if (!shouldAnimate) return;

      setTimeout(() => this.runAnimation(), 30);
    });
  };

  stopAnimation = (): void => {
    const { value } = this.state;
    value.stopAnimation();
  };

  getAnimationStyles = (): Object => {
    const { value } = this.state;

    return {
      transform: [
        {
          rotate: value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['0deg', '360deg', '0deg'],
          }),
        },
        {
          scale: value.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.1, 1],
          }),
        },
      ],
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
});
