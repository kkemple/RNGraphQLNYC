import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  View,
  StyleSheet,
} from 'react-native';

import { colors } from '../styles';

type Props = {
  imageType: 'string',
};

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const ANIMATION_END_Y = Math.ceil(deviceHeight * 0.5);
const NEGATIVE_END_Y = ANIMATION_END_Y * -1;

const imageMap = {
  graphql: require('../assets/graphql-logo.png'),
  submitting: require('../assets/upload.png'),
  success: require('../assets/check.png'),
  error: require('../assets/warning.png'),
};

const getRandomDelay = (min?: number = 0, max?: number = 1000): number => {
  return Math.random() * (max - min) + min;
};

const getRandomX = (
  min?: number = 0,
  max?: number = deviceWidth - 200,
): number => {
  return Math.random() * (max - min) + min;
};

const getRandomY = (
  min?: number = 0,
  max?: number = deviceHeight / 2,
): number => {
  return Math.random() * (max - min) + min;
};

class FloatingParticle extends Component<*, Props, State> {
  state = {
    position: new Animated.Value(0),
  };

  componentWillMount = () => {
    this._yAnimation = this.state.position.interpolate({
      inputRange: [NEGATIVE_END_Y, 0],
      outputRange: [ANIMATION_END_Y, 0],
    });

    this._opacityAnimation = this._yAnimation.interpolate({
      inputRange: [0, ANIMATION_END_Y],
      outputRange: [0.9, 0],
    });

    this._scaleAnimation = this._yAnimation.interpolate({
      inputRange: [0, 15, 30],
      outputRange: [0, 1.2, 1],
      extrapolate: 'clamp',
    });

    this._rotateAnimation = this._yAnimation.interpolate({
      inputRange: [
        0,
        ANIMATION_END_Y / 4,
        ANIMATION_END_Y / 3,
        ANIMATION_END_Y / 2,
        ANIMATION_END_Y,
      ],
      outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg'],
    });
  };

  componentDidMount = () => {
    this.runAnimation();
  };

  render = () => {
    const { style, imageType = 'graphql' } = this.props;

    return (
      <Animated.Image
        source={imageMap[imageType]}
        style={[styles.image, this.getAnimationStyles()]}
      />
    );
  };

  getAnimationStyles = () => {
    const startX = getRandomX();

    return {
      transform: [
        { translateY: this.state.position },
        {
          translateX: this._yAnimation.interpolate({
            inputRange: [0, ANIMATION_END_Y / 2, ANIMATION_END_Y],
            outputRange: [startX / 2, startX, startX + startX / 2],
          }),
        },
        { scale: this._scaleAnimation },
        { rotate: this._rotateAnimation },
      ],
      opacity: this._opacityAnimation,
      bottom: getRandomY(),
      left: getRandomX(),
    };
  };

  runAnimation = () => {
    this.state.position.setValue(0);
    Animated.timing(this.state.position, {
      delay: getRandomDelay(),
      duration: 2000,
      toValue: NEGATIVE_END_Y,
      easing: Easing.out(Easing.sin),
      useNativeDriver: true,
    }).start(this.runAnimation);
  };
}

export default class FloatingParticles extends Component {
  render = () => {
    const { style, imageType = 'graphql' } = this.props;

    return (
      <View style={[styles.container, style]}>
        {Array.from(
          { length: Platform.OS === 'ios' ? 15 : 10 },
          (value, key) => key,
        ).map(_ => {
          return (
            <FloatingParticle
              key={`animated-particle-${_}`}
              imageType={imageType}
            />
          );
        })}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  image: {
    width: 24,
    height: 24,
    tintColor: colors.white,
    opacity: 0,
    position: 'absolute',
  },
});
