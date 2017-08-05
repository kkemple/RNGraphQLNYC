// @flow
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, View, WebView } from 'react-native';
import { Agenda } from 'react-native-calendars';

import Loader from '../components/loader';
import { colors } from '../styles';

type NavigationOptions = {
  tabBarLabel: string,
  tabBarIcon: ({ tintColor: string }) => React.Element<*>,
};

export default class Docs extends Component {
  static navigationOptions: NavigationOptions = {
    tabBarLabel: 'Docs',
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../assets/docs.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />,
  };

  state = {
    viewHeight: 0,
    viewWidth: 0,
  };

  render = (): React.Element<*> => {
    return (
      <View style={styles.container}>
        <View style={styles.webview} onLayout={this.onLayout}>
          <WebView
            style={{
              backgroundColor: 'transparent',
              width: this.state.viewWidth,
              height: this.state.viewHeight,
            }}
            renderLoading={() => <Loader />}
            startInLoadingState
            source={{ uri: 'http://graphql.org/learn' }}
          />
        </View>
      </View>
    );
  };

  onLayout = ({ width, height }) => {
    this.setState(() => ({
      viewHeight: height,
      viewWidth: width,
    }));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 26,
    height: 26,
  },
  webview: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
