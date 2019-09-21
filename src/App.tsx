import React from 'react'
import { Scene, Router, Stack } from 'react-native-router-flux'
import colors from './colors'

import Home from './scenes/Home'
import Login from './scenes/Login'

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
      <Scene
        key='home'
        component={Home}
      />
    </Stack>
  </Router>