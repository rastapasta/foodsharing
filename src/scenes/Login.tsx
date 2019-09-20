import React, { PureComponent } from 'react'
import { Text, SafeAreaView, StatusBar, StyleSheet } from 'react-native'

import LoginTextInput from '../components/LoginTextInput'
import LoginForgotPassword from '../components/LoginForgotPassword'

import colors from '../colors'

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

        {/* <TouchableOpacity style={{width, alignItems: 'flex-end'}}>
          <Text>Login</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    )
  }
}
