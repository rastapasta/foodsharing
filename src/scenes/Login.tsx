import React, {PureComponent} from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  View,
  Linking,
  Keyboard,
  Platform
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { Form } from 'react-redux-form/native'

import Toast from 'react-native-easy-toast'
import SplashScreen from 'react-native-splash-screen'

import Logo from '../components/Logo'
import LoginTextInput from '../components/LoginTextInput'
import LoginButton from '../components/LoginButton'
import LoginForgotPassword from '../components/LoginForgotPassword'
import Version from '../components/Version'

import colors from '../common/colors'

const {width} = Dimensions.get('window')
    , registerURL = 'https://foodsharing.de/?page=content&sub=joininfo'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    width: width - 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 30
  }
})

type Props = {}

class Login extends PureComponent<Props> {
  refs: {
    toast: Toast
  }

  state = {
    email: null,
    password: null
  }

  componentDidMount() {
    SplashScreen.hide()
  }
  // doLogin = async () => {
  //   const {email, password} = this.state

  //   Keyboard.dismiss()

  //   try {
  //     const { name } = await login(email, password)
  //     this.refs.toast.show(`Welcome, ${name}!`, 3000)
  //   } catch(e) {
  //     this.refs.toast.show(translate('login.failed'), 1000)
  //   }
  // }

  render() {
    const { actions } = this.props as any
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          enabled
          style={styles.form}
          {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        >
          <Logo size={32} />

          <View style={{height: 50}} />

          <Form model="login">
            <LoginTextInput
              icon="account"
              placeholder="login.email"
              model=".email"
            />

            <LoginTextInput
              icon="key"
              placeholder="login.password"
              obfuscate
              model=".password"
            />

            <LoginForgotPassword />

            <View style={styles.buttons}>
              <LoginButton
                label="login.register"
                onPress={() => Linking.openURL(registerURL)}
              />
              <LoginButton
                label="login.login"
                raised
                onPress={() => {
                  Keyboard.dismiss()
                  actions.login()
                }}
              />
            </View>
          </Form>

          <Version />
          <Toast ref="toast" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
