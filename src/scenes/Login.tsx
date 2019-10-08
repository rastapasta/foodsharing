import React, {PureComponent} from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  View,
  Linking,
  Keyboard,
  Platform,
  StatusBar
} from 'react-native'

import { withNavigationFocus } from 'react-navigation'

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
import { translate } from '../common/translation'

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
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageText: {
    color: colors.white
  }
})

type Props = {
  actions: any
  isFocused: boolean
  app: any
}

class Login extends PureComponent<Props> {
  refs: {
    toast: Toast
  }

  state = {
    email: null,
    password: null
  }

  componentDidUpdate(prevProps: Props) {
    const { actions, app: { authenticating } } = this.props

    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('login')

    if (prevProps.app.authenticating !== authenticating && authenticating === false)
      this.refs.toast.show(translate('login.failed'), 3000)
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('login')
    SplashScreen.hide()
  }

  render() {
    const { actions, app: { authenticating } } = this.props
    return (
      <SafeAreaView style={styles.container} testID="login.scene">
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
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
                loading={authenticating}
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

const mapStateToProps = (state) => ({
  app: state.app
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Login))
