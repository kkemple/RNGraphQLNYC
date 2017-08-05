// @flow
import React, { Component } from 'react';
import { Image, Linking, Platform, StyleSheet, View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { gql, graphql } from 'react-apollo';

import {
  format,
  getDaysInMonth,
  parse,
  isBefore,
  addDays,
  addMonths,
  subMonths,
} from 'date-fns';

import AgendaCard from '../components/agenda-card';
import AgendaDate from '../components/agenda-date';
import AgendaNoData from '../components/agenda-no-data';
import Loader from '../components/loader';
import { colors } from '../styles';

type NavigationOptions = {
  tabBarLabel: string,
  tabBarIcon: ({ tintColor: string }) => React.Element<*>,
};

type State = {
  selectedDate: string,
  items: {
    [key: string]: Array<AgendaEvent>,
  },
};

type Props = {
  loading: boolean,
  error: Error,
  events: {
    [key: string]: Array<AgendaEvent>,
  },
};

const QUERY = gql`
  query Events {
    events {
      time
      name
      description
      status
      link
      venue {
        name
        lat
        lon
      }
    }
  }
`;

const agendaTheme = {
  textSectionTitleColor: colors.graphql,
  selectedDayBackgroundColor: colors.graphql,
  selectedDayTextColor: colors.white,
  todayTextColor: colors.graphql,
  dayTextColor: colors.text,
  textDisabledColor: colors.textDisabled,
  dotColor: colors.graphql,
  selectedDotColor: colors.white,
  arrowColor: colors.graphql,
  monthTextColor: colors.graphql,
  agendaDayTextColor: colors.graphql,
  agendaDayNumColor: colors.graphql,
  agendaTodayColor: colors.graphql,
  textDayFontFamily: 'dinRegular',
  textMonthFontFamily: 'dinHeavy',
  textDayHeaderFontFamily: 'dinMedium',
};

class Schedule extends Component<*, Props, State> {
  static navigationOptions: NavigationOptions = {
    tabBarLabel: 'Schedule',
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../assets/graphql-logo.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />,
  };

  state = {
    selectedDate: '',
    items: {},
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.nextEventDate && !this.props.nextEventDate) {
      this.setState(() => ({ selectedDate: nextProps.nextEventDate }));
    }
  };

  render = (): React.Element<*> => {
    const { loading, events, nextEventDate } = this.props;
    const { items, selectedDate } = this.state;

    return (
      <View style={styles.container}>
        {loading && <Loader />}
        {!loading &&
          events &&
          <Agenda
            items={items}
            renderItem={(item, firstItemInDay) =>
              <AgendaCard
                item={item}
                firstItemInDay={firstItemInDay}
                onPress={() => Linking.openURL(item.link)}
              />}
            renderDay={(day, item) => <AgendaDate day={day} item={item} />}
            renderEmptyDate={() => <AgendaNoData />}
            loadItemsForMonth={this.loadItemsForMonth}
            rowHasChanged={(r1, r2) => r1 !== r2}
            selected={selectedDate}
            onDayPress={this.onDayPress}
            theme={agendaTheme}
          />}
      </View>
    );
  };

  onDayPress = ({ dateString }: CalendarEventPayload): void =>
    this.setState(() => ({ selectedDate: dateString }));

  loadItemsForMonth = ({ timestamp }: CalendarEventPayload): void => {
    const items = {};
    const x = parse(timestamp);
    let y = subMonths(x, 2);
    const z = addMonths(x, 2);

    while (isBefore(y, z)) {
      const dateString = format(y, 'YYYY-MM-DD');
      items[dateString] = this.props.events[dateString]
        ? this.props.events[dateString]
        : [];
      y = addDays(y, 1);
    }

    this.setState(({ items: old }) => ({
      items: { ...old, ...items },
    }));
  };
}

export default graphql(QUERY, {
  props: ({ data }) => {
    const events = {};
    let nextEventDate;

    if (data.events && data.events.length) {
      data.events.forEach(event => {
        const date = format(parseInt(event.time, 10), 'YYYY-MM-DD');
        if (events[date]) events.date.push(event);
        else events[date] = [event];
      });

      const upcoming = data.events.filter(event => event.status === 'upcoming');
      nextEventDate = upcoming.length
        ? format(parseInt(upcoming.shift().time, 10), 'YYYY-MM-DD')
        : undefined;
    }

    return {
      events,
      nextEventDate,
      loading: data.loading,
      error: data.error,
    };
  },
})(Schedule);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 26,
    height: 26,
  },
});
