import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Constants, Font } from 'expo';
import { createNetworkInterface } from 'apollo-client';
import { ApolloProvider, ApolloClient } from 'react-apollo';

import Schedule from './screens/schedule';
import CFP from './screens/cfp';
import Camera from './screens/camera';
import Docs from './screens/docs';
import SupportUs from './screens/support';

import { colors } from './styles';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://w1z9m133z.lp.gql.zone/graphql',
  }),
});

const tabs = true
  ? {
      Home: {
        screen: Schedule,
      },
      CFP: {
        screen: CFP,
      },
      Camera: {
        screen: Camera,
      },
      Docs: {
        screen: Docs,
      },
      Support: {
        screen: SupportUs,
      },
    }
  : {
      Home: {
        screen: Schedule,
      },
      CFP: {
        screen: CFP,
      },
      Docs: {
        screen: Docs,
      },
      Support: {
        screen: SupportUs,
      },
    };

const Tabs = TabNavigator(tabs, {
  swipeEnabled: false,
  animationEnabled: false,
  tabBarPosition: 'bottom',
  lazy: true,
  navigationOptions: {
    headerTintColor: colors.graphql,
  },
  tabBarOptions: {
    showIcons: true,
    activeTintColor: colors.graphql,
    inactiveTintColor: colors.textDisabled,
    scrollEnabled: true,
    labelStyle: {
      fontFamily: 'dinMedium',
    },
    style: {
      backgroundColor: colors.white,
      borderTopColor: colors.border,
      paddingBottom: 2,
      paddingTop: 2,
      marginBottom: 0,
    },
    indicatorStyle: {
      backgroundColor: colors.graphql,
    },
  },
});

export default class App extends Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      dinBold: require('./assets/fonts/DINPro-Black.ttf'),
      dinHeavy: require('./assets/fonts/DINPro-Bold.ttf'),
      dinRegular: require('./assets/fonts/DINPro-Regular.ttf'),
      dinMedium: require('./assets/fonts/DINPro-Medium.ttf'),
      dinLight: require('./assets/fonts/DINPro-Light.ttf'),
    });

    this.setState({
      fontLoaded: true,
    });
  }

  render = () => {
    return this.state.fontLoaded
      ? <ApolloProvider client={client}>
          <View style={styles.container}>
            <StatusBar
              backgroundColor={colors.graphql}
              barStyle={Platform.OS === 'android' ? 'light-content' : undefined}
            />
            <Tabs />
          </View>
        </ApolloProvider>
      : null;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
