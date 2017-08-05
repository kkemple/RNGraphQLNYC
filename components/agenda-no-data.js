import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../styles';

export default () =>
  <View style={styles.container}>
    <View style={styles.line} />
  </View>;

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 32,
    marginRight: 16,
  },
  line: {
    marginTop: -20,
    height: 1,
    backgroundColor: colors.background,
  },
});
