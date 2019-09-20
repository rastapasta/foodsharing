import React, { PureComponent } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Dimensions, View, TouchableOpacity, Text, Linking } from 'react-native'

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
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5
  },
  login: {
    backgroundColor: colors.white,
  },
  loginText: {
    color: colors.background,
  }
})


type Props = {}

export default class Home extends PureComponent<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
        <Text style={styles.logo}>
          <Text style={{color: colors.white}}>food</Text>
          <Text style={{color: colors.green}}>sharing</Text>
        </Text>

        <LoginTextInput icon="account" placeholder="E-Mail" />
        <LoginTextInput icon="key" placeholder="Password" obfuscate />

        <LoginForgotPassword />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => Linking.openURL(registerURL)}
            style={styles.button}
          >
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.login]}>
            <Text style={[styles.text, styles.loginText]}>Login</Text>
          </TouchableOpacity>
        </View>

        <Version />
      </SafeAreaView>
    )
  }
}
