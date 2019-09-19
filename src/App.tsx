import React from 'react'
import { Scene, Router, Stack } from 'react-native-router-flux'
import Home from './scenes/Home'
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
        key='home'
        component={Home}
        initial
      />
    </Stack>
  </Router>