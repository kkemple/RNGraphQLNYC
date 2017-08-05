// @flow
import React, { Component } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import CFPForm from '../components/cfp-form';

type NavigationOptions = {
  tabBarLabel: string,
  tabBarIcon: ({ tintColor: string }) => React.Element<*>,
};

export default class CFP extends Component<*, *, *> {
  static navigationOptions: NavigationOptions = {
    tabBarLabel: 'Submit CFP',
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../assets/mic.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />,
  };

  render = (): React.Element<*> => {
    return (
      <View style={styles.container}>
        <CFPForm />
      </View>
    );
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
});
