import React from 'react'
import { Scene, Router, Stack } from 'react-native-router-flux'
import Login from './scenes/Login'
import colors from './colors'

export default () =>
  <Router>
    <Stack
      key='root'
      titleStyle={{ alignSelf: 'center', color: 'white' }}
      navigationBarStyle={{ backgroundColor: colors.background }}
      hideNavBar
    >
      <Scene
        key='login'
        component={Login}
        initial
      />
    </Stack>
  </Router>