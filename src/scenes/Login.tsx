import React, {PureComponent} from 'react'
import { SafeAreaView, KeyboardAvoidingView, StatusBar, StyleSheet, Dimensions, View, TouchableOpacity, Text, Linking, Keyboard } from 'react-native'

import Toast from 'react-native-easy-toast'

import LoginTextInput from '../components/LoginTextInput'
import LoginForgotPassword from '../components/LoginForgotPassword'
import Version from '../components/Version'

import colors from '../utils/colors'
import { translate } from '../utils/translation'
import { login } from '../utils/api'

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
    email: null,
    password: null
  }

  doLogin = async () => {
    const {email, password} = this.state

    Keyboard.dismiss()

    try {
      const { name } = await login(email, password)
      this.refs.toast.show(`Welcome, ${name}!`, 3000)
      // console.log(await getCurrentUser())
      // console.log(await getWall('foodsaver', 136735))
    } catch(e) {
      this.refs.toast.show(translate('login.failed'), 1000)
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
          <StatusBar backgroundColor={colors.background} barStyle="light-content" />

          <View>
            <Text style={styles.logo}>
              <Text style={{color: colors.white}}>food</Text>
              <Text style={{color: colors.green}}>sharing</Text>
            </Text>
          </View>

          <LoginTextInput
            icon="account"
            placeholder={translate('login.email')}
            onChange={email => this.setState({email})}
          />

          <LoginTextInput
            icon="key"
            placeholder={translate('login.password')}
            obfuscate
            onChange={password => this.setState({password})}
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
              onPress={this.doLogin}
            >
              <Text style={[styles.text, styles.loginText]}>
                {translate('login.login')}
              </Text>
            </TouchableOpacity>
          </View>

          <Version />
          <Toast ref="toast" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
