import React, { Component } from 'react';
import {
  Linking,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MapView } from 'expo';

import { colors } from '../styles';

const buildMapLink = (lat: string, lon: string) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

export default ({ item, firstItemInDay, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) onPress(item);
      }}
      style={styles.container}
    >
      <Text style={styles.title}>
        {item.name}
      </Text>
      {item.venue &&
        <Text style={styles.location}>
          Hosted by: {item.venue.name}
        </Text>}
      {item.venue &&
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(buildMapLink(item.venue.lat, item.venue.lon))}
        >
          <MapView
            style={{ flex: 1, height: 150 }}
            initialRegion={{
              latitude: parseFloat(item.venue.lat),
              longitude: parseFloat(item.venue.lon),
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0421,
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: parseFloat(item.venue.lat),
                longitude: parseFloat(item.venue.lon),
              }}
              title={item.venue.name}
            />
          </MapView>
        </TouchableOpacity>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    backgroundColor: colors.white,
    padding: 16,
    paddingTop: 8,
    marginRight: 16,
    marginTop: 32,
  },
  location: {
    color: colors.text,
    fontFamily: 'dinMedium',
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'dinBold',
    color: colors.graphql,
    marginBottom: 4,
  },
});
