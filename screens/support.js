import React, { Component } from 'react';
import { Image, Platform, StyleSheet, View, WebView } from 'react-native';
import { Agenda } from 'react-native-calendars';

import Loader from '../components/loader';
import { colors } from '../styles';

type NavigationOptions = {
  tabBarLabel: string,
  title: string,
};

export default class SupportUs extends Component {
  static navigationOptions: NavigationOptions = {
    tabBarLabel: 'Support Us',
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../assets/favorite.png')}
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
              width: this.state.viewWidth,
              height: this.state.viewHeight,
            }}
            onError={err => console.log(err)}
            renderLoading={() => <Loader />}
            startInLoadingState
            scalesPageToFit={false}
            source={{ uri: 'https://opencollective.com/graphqlnyc' }}
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
