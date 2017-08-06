// @flow
import React, { Component } from 'react';
import {
  Alert,
  CameraRoll,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImagePicker, takeSnapshotAsync } from 'expo';

import graphqlLogo from '../assets/graphql-logo.png';
import photoCamera from '../assets/photo-camera.png';
import { colors } from '../styles';

type NavigationOptions = {
  tabBarLabel: string,
  tabBarIcon: ({ tintColor: string }) => React.Element<*>,
};

export default class Camera extends Component {
  imageContainer: View;

  static navigationOptions: NavigationOptions = {
    tabBarLabel: 'Camera',
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={require('../assets/camera.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />,
  };

  state = {
    photo: null,
  };

  takePhoto = async () => {
    try {
      const { uri: photo, cancelled } = await ImagePicker.launchCameraAsync();

      if (!cancelled) {
        this.setState(() => ({ photo }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  savePhoto = async () => {
    try {
      let result = await takeSnapshotAsync(this.imageContainer, {
        format: 'png',
        result: 'file',
      });

      await CameraRoll.saveToCameraRoll(result, 'photo');

      Alert.alert('Photo Saved!', 'Your photo was saved to your device!');
      this.setState(() => ({ photo: undefined }));
    } catch (error) {
      Alert.alert('Oops!', error.message);
    }
  };

  cancelSave = () => {
    this.setState(() => ({ photo: undefined }));
  };

  render() {
    const { photo } = this.state;

    return (
      <View style={styles.container}>
        {photo
          ? <View
              style={styles.imageContainer}
              collapsable={false}
              ref={view => {
                this.imageContainer = view;
              }}
            >
              <Image
                source={{ uri: photo }}
                accessibilityLabel="A selfie of the GraphQL NYC meetup"
                style={styles.image}
              />
              <Image
                source={graphqlLogo}
                accessibilityLabel="GraphQL Logo"
                style={styles.graphqlLogo}
              />
              <Text style={styles.graphqlText}>GraphQL NYC</Text>
            </View>
          : <TouchableOpacity
              onPress={this.takePhoto}
              style={styles.cameraButton}
            >
              <Image
                source={photoCamera}
                accessibilityLabel="Take a selfie!"
                style={styles.cameraButtonIcon}
              />
            </TouchableOpacity>}
        {photo &&
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={this.cancelSave}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={this.savePhoto}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>}
      </View>
    );
  }
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  actions: {
    flex: 1,
    flexDirection: 'row',
    width: windowWidth,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  cameraButtonIcon: {
    width: 64,
    height: 64,
    tintColor: colors.graphql,
  },
  cameraButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  icon: {
    width: 26,
    height: 26,
  },
  image: {
    width: windowWidth,
    height: windowHeight - 150,
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight - 150,
    backgroundColor: colors.black,
    position: 'relative',
  },
  graphqlLogo: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  graphqlText: {
    fontFamily: 'dinMedium',
    fontSize: 24,
    color: colors.white,
    position: 'absolute',
    bottom: 22,
    left: 64,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.6,
    padding: 24,
    color: 'white',
  },
  saveButton: {
    width: windowWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.graphql,
  },
  saveText: {
    fontSize: 24,
    color: colors.white,
    backgroundColor: 'transparent',
  },
  cancelButton: {
    width: windowWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  cancelText: {
    fontSize: 24,
    color: colors.textDisabled,
    backgroundColor: 'transparent',
  },
});
