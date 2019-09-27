import React, {PureComponent} from 'react'
import { SafeAreaView, KeyboardAvoidingView, StatusBar, StyleSheet, Dimensions, View, TouchableOpacity, Text, Linking, Keyboard } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { Form } from 'react-redux-form/native'

import Toast from 'react-native-easy-toast'

import Logo from '../components/Logo'
import LoginTextInput from '../components/LoginTextInput'
import LoginForgotPassword from '../components/LoginForgotPassword'
import Version from '../components/Version'

import colors from '../common/colors'
import { translate } from '../common/translation'
import { login } from '../common/api'

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

class Login extends PureComponent<Props> {
  refs: {
    toast: Toast
  }

  state = {
    email: null,
    password: null
  }

  doLogin = async () => {
    const {email, password} = this.state

    Keyboard.dismiss()

    try {
      const { name } = await login(email, password)
      this.refs.toast.show(`Welcome, ${name}!`, 3000)
    } catch(e) {
      this.refs.toast.show(translate('login.failed'), 1000)
    }
  }

  render() {
    const { actions } = this.props as any
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
          <StatusBar backgroundColor={colors.background} barStyle="light-content" />

          <Logo size={32} />

          <View style={{height: 50}} />

          <Form model="login">
            <LoginTextInput
              icon="account"
              placeholder={translate('login.email')}
              model=".email"
            />

            <LoginTextInput
              icon="key"
              placeholder={translate('login.password')}
              obfuscate
              model=".password"
            />

            <LoginForgotPassword />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => Linking.openURL(registerURL)}
              >
                <Text style={styles.text}>
                  {translate('login.register')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.login]}
                onPress={() => actions.login()}
              >
                <Text style={[styles.text, styles.loginText]}>
                  {translate('login.login')}
                </Text>
              </TouchableOpacity>
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
