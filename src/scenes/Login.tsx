import React, {PureComponent} from 'react'
import {KeyboardAvoidingView, StatusBar, StyleSheet, Dimensions, View, TouchableOpacity, Text, Linking, Keyboard} from 'react-native'
import Toast from 'react-native-easy-toast'

import LoginTextInput from '../components/LoginTextInput'
import LoginForgotPassword from '../components/LoginForgotPassword'
import Version from '../components/Version'

import colors from '../colors'

const {width} = Dimensions.get('window')
    , registerURL = 'https://foodsharing.de/?page=content&sub=joininfo'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    fontSize: 32,
    fontFamily: 'AlfaSlabOne-Regular',
    marginBottom: 30
  },

  buttons: {
    width: width - 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30
  },

  text: {
    fontFamily: 'SFMono-Regular',
    textTransform: 'uppercase',
    color: colors.white,
    fontSize: 14
  },
  button: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    paddingLeft: 15
  },
  login: {
    backgroundColor: colors.white,
    paddingRight: 15,
  },
  loginText: {
    color: colors.background,
  }
})


type Props = {}

export default class Home extends PureComponent<Props> {
  refs: {
    toast: Toast
  }
  state = {
    user: null,
    password: null
  }

  doLogin = () => {
    // const {user, password} = this.state
    Keyboard.dismiss()
    this.refs.toast.show('Here we go! Needs implementation :)')
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
        <Text style={styles.logo}>
          <Text style={{color: colors.white}}>food</Text>
          <Text style={{color: colors.green}}>sharing</Text>
        </Text>

        <LoginTextInput
          icon="account"
          placeholder="E-Mail"
          onChange={user => this.setState({user})}
        />

        <LoginTextInput
          icon="key"
          placeholder="Password"
          obfuscate
          onChange={password => this.setState({password})}
        />

        <LoginForgotPassword />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(registerURL)}
          >
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.login]}
            onPress={this.doLogin}
          >
            <Text style={[styles.text, styles.loginText]}>Login</Text>
          </TouchableOpacity>
        </View>

        <Version />
        <Toast ref="toast" />
      </KeyboardAvoidingView>
    )
  }
}
