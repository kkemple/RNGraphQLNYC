// @flow
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { parse, format, addDays } from 'date-fns';

import { colors } from '../styles';

type Props = {
  day: CalendarEventPayload,
  item: AgendaEvent,
};

export default ({ day, item }: Props) =>
  <View style={styles.container}>
    <Text style={styles.date}>
      {day.day}
    </Text>
    <Text style={styles.day}>
      {format(addDays(parse(day.timestamp), 1), 'ddd')}
    </Text>
  </View>;

const styles = StyleSheet.create({
  container: {
    width: 63,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  date: {
    color: colors.graphql,
    fontSize: 28,
    fontFamily: 'dinMedium',
    fontWeight: '200',
  },
  day: {
    ...Platform.select({
      ios: { marginTop: -10 },
      android: { marginTop: 0 },
    }),
    color: colors.graphql,
    fontSize: 16,
    fontFamily: 'dinRegular',
    fontWeight: '200',
    backgroundColor: 'transparent',
  },
});
