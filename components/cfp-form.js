// @flow
import React, { Component } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { TabViewAnimated } from 'react-native-tab-view';
import { validate } from 'email-validator';
import qs from 'qs';

import FloatingParticles from './floating-particles';
import Loader from './loader';
import { colors } from '../styles';

type Route = {
  key: string,
  title: string,
};

type Form = {
  description: string,
  email: string,
  name: string,
  title: string,
};

type FormData = {
  [key: string]: string,
};

type State = {
  form: Form,
  index: number,
  routes: Array<Route>,
  submitting: boolean,
  error?: string,
  success: boolean,
  canStepForward: boolean,
};

type FullScreenInputProps = {
  onBlur?: () => void,
  onChangeText: (text: string) => void,
  type: string,
  value: string,
  error?: string,
};

const FORM_URI =
  'https://docs.google.com/forms/d/1RvQDiUAmG-hz4nAAZ3wr7_RykzWqa9t6h4y0LfDZZaE/formResponse';

const getTextForInputLabel = (type: string): string => {
  switch (type) {
    case 'Name':
      return 'What is your name?';
    case 'Email':
      return 'What is your email?';
    case 'Title':
      return 'What is the title of your talk?';
    case 'Description':
      return 'What is your talk about?';
    default:
      return 'Whoa, how did we get here?';
  }
};

const getNumberOfLinesForInput = (type: string): number => {
  switch (type) {
    case 'Name':
      return 1;
    case 'Email':
      return 1;
    case 'Title':
      return 1;
    case 'Description':
      return 2;
    default:
      return 1;
  }
};

class WarningLabel extends Component<*, *, *> {
  state = {
    value: new Animated.Value(0),
  };

  componentWillMount = () => {
    this.opacityAnimation = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    this.translateYAnimation = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: 'clamp',
    });
  };

  componentDidMount = () => {
    Animated.timing(this.state.value, {
      duration: 400,
      toValue: 1,
      easing: Easing.out(Easing.sin),
    }).start();
  };

  componentWillUnmount = () => {
    Animated.timing(this.state.value, {
      duration: 400,
      toValue: 0,
    }).start();
  };

  render = () => {
    return (
      <Animated.Text
        style={[
          styles.inputWarningLabel,
          {
            opacity: this.opacityAnimation,
            transform: [{ translateY: this.translateYAnimation }],
          },
        ]}
      >
        {this.props.message}
      </Animated.Text>
    );
  };
}

const mapFormDataToGoogleIds = (data: Form): FormData => {
  return {
    'entry.2005620554': data.name,
    'entry.1045781291': data.email,
    'entry.900324822': data.title,
    'entry.2073900503': data.description,
  };
};

const validateEmail = (email: string): boolean => {
  return validate(email);
};

const FullScreenInput = (props: FullScreenInputProps) => {
  const { onBlur, onChangeText, type, value, error } = props;

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>
        {getTextForInputLabel(type)}
      </Text>
      <TextInput
        autoCapitalize="none"
        blurOnSubmit={type.toLowerCase() !== 'description'}
        multiline={type.toLowerCase() === 'description'}
        numberOfLines={getNumberOfLinesForInput(type)}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onSubmitEditing={Keyboard.dismiss}
        style={styles.input}
        underlineColorAndroid="transparent"
        value={value}
      />
      {error && <WarningLabel message={error} />}
    </View>
  );
};

export default class CFPForm extends Component<*, *, State> {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Name' },
      { key: '2', title: 'Email' },
      { key: '3', title: 'Title' },
      { key: '4', title: 'Description' },
    ],
    form: {
      description: '',
      email: '',
      name: '',
      title: '',
    },
    canStepForward: false,
    error: undefined,
    submitting: false,
    success: false,
  };

  render = (): React.Element<*> => {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <TabViewAnimated
            navigationState={this.state}
            onIndexChange={this.handleIndexChange}
            renderScene={this.renderScene}
            style={styles.tabViewContainer}
            swipeEnabled={false}
          />
          {this.state.error &&
            <FloatingParticles
              imageType="error"
              style={styles.particlesContainer}
            />}
          {this.state.submitting &&
            <FloatingParticles
              imageType="submitting"
              style={styles.particlesContainer}
            />}
          {this.state.success &&
            <FloatingParticles
              imageType="success"
              style={styles.particlesContainer}
            />}
        </KeyboardAvoidingView>
        <View style={styles.actionBar}>
          {this.state.index > 0 &&
            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.button} onPress={this.onStepBack}>
                <Text style={styles.buttonText}>BACK</Text>
              </TouchableOpacity>
            </View>}
          {this.state.index < 3 &&
            <View style={styles.actionWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.onStepForward}
              >
                <Text
                  style={[
                    styles.buttonText,
                    !this.state.canStepForward && styles.buttonDisabledText,
                  ]}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>}
          {this.state.index === 3 &&
            <View style={styles.actionWrapper}>
              <TouchableOpacity style={styles.button} onPress={this.onSubmit}>
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>}
        </View>
      </View>
    );
  };

  renderScene = ({ route }: { route: Route }): React.Element<*> | null => {
    const { error, form } = this.state;

    switch (route.title) {
      case 'Name':
        return (
          <FullScreenInput
            error={error}
            onBlur={this.onNameBlur}
            onChangeText={this.onNameChange}
            type={route.title}
            value={form[route.title.toLowerCase()]}
          />
        );
      case 'Email':
        return (
          <FullScreenInput
            error={error}
            onBlur={this.onEmailBlur}
            onChangeText={this.onEmailChange}
            type={route.title}
            value={form[route.title.toLowerCase()]}
          />
        );
      case 'Title':
        return (
          <FullScreenInput
            error={error}
            onBlur={this.onTitleBlur}
            onChangeText={this.onTitleChange}
            type={route.title}
            value={form[route.title.toLowerCase()]}
          />
        );
      case 'Description':
        return (
          <FullScreenInput
            error={error}
            onChangeText={this.onDescriptionChange}
            type={route.title}
            value={form[route.title.toLowerCase()]}
          />
        );
      default:
        return null;
    }
  };

  handleIndexChange = (index: number): void => this.setState(() => ({ index }));

  onStepBack = (): void =>
    this.setState(({ index }: State) => ({
      index: index - 1,
      canStepForward: true,
    }));

  onStepForward = (): void => {
    if (!this.state.canStepForward) return;
    this.setState(({ index }: State) => ({
      index: index + 1,
      canStepForward: false,
    }));
  };

  onNameChange = (text: string): void =>
    this.setState((state: State) => ({ form: { ...state.form, name: text } }));

  onNameBlur = (): void => {
    if (this.state.form.name.length < 3) {
      this.showError('Name must be at least 3 characters!');
    } else {
      this.setState(() => ({ canStepForward: true, error: undefined }));
    }
  };

  onEmailChange = (text: string): void =>
    this.setState((state: State) => ({ form: { ...state.form, email: text } }));

  onEmailBlur = (): void => {
    if (!validateEmail(this.state.form.email)) {
      this.showError('Not a valid email!');
    } else {
      this.setState(() => ({ canStepForward: true, error: undefined }));
    }
  };

  onTitleChange = (text: string): void =>
    this.setState((state: State) => ({ form: { ...state.form, title: text } }));

  onTitleBlur = (): void => {
    if (this.state.form.title.length < 3) {
      this.showError('Title must be at least 3 characters!');
    } else {
      this.setState(() => ({ canStepForward: true, error: undefined }));
    }
  };

  onDescriptionChange = (text: string): void =>
    this.setState((state: State) => ({
      form: { ...state.form, description: text },
    }));

  showError = (message: string): void => {
    this.setState(
      () => ({ error: message, submitting: false, canStepForward: false }),
      () =>
        setTimeout(() => {
          this.setState(() => ({ error: undefined }));
        }, 2000),
    );
  };

  onSubmit = (): void => {
    if (this.state.submitting) return;

    if (this.state.form.description.length < 20) {
      this.showError("That's all you have to say about GraphQL?");
    } else {
      this.setState(
        () => ({ submitting: true, error: undefined }),
        async () => {
          try {
            const response = await fetch(FORM_URI, {
              method: 'POST',
              headers: {
                Accept: 'application/xml, text/xml, */*; q=0.01',
                'Content-type':
                  'application/x-www-form-urlencoded; charset=UTF-8',
              },
              body: qs.stringify(mapFormDataToGoogleIds(this.state.form)),
            });

            if (response.ok) {
              this.setState(
                () => ({ success: true, submitting: false }),
                () =>
                  setTimeout(() => {
                    this.resetForm();
                  }, 2000),
              );
            } else {
              this.showError(response.error);
            }
          } catch (error) {
            this.showError(error.message);
          }
        },
      );
    }
  };

  resetForm = (): void => {
    this.setState(() => ({
      index: 0,
      success: false,
      form: {
        name: '',
        email: '',
        title: '',
        description: '',
      },
    }));
  };
}

const styles = StyleSheet.create({
  actionBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionWrapper: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.white,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.graphql,
    fontWeight: 'bold',
    fontFamily: 'dinBold',
  },
  buttonDisabledText: {
    color: colors.textDisabled,
  },
  container: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9,
  },
  inputContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.graphql,
  },
  input: {
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
    color: colors.white,
    padding: 4,
    width: '100%',
    fontSize: 18,
    fontFamily: 'dinRegular',
  },
  inputLabel: {
    fontFamily: 'dinLight',
    marginBottom: 8,
    color: colors.white,
    fontSize: 28,
  },
  inputWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 24,
  },
  inputWarningLabel: {
    fontFamily: 'dinBold',
    marginTop: 4,
    color: colors.white,
    fontSize: 12,
    letterSpacing: 1.05,
  },
  tabViewContainer: {
    flex: 1,
  },
});
