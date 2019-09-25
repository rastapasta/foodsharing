import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Scene, Router, Stack, Tabs } from 'react-native-router-flux'
import colors from './colors'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Login from './scenes/Login'
import Messages from './scenes/Messages'
import Home from './scenes/Home'

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.background,
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#fff',
  }
})

const icon = (name: string) =>
  () => <Icon name={name} size={32} style={{marginTop: 3, color: colors.white}}/>

export default () =>
  <Router>
    <Stack
      key='root'
      titleStyle={{ alignSelf: 'center', color: 'white' }}
      navigationBarStyle={{ backgroundColor: colors.background }}
      hideNavBar
    >
      <Tabs
        key="main"
        backToInitial
        // onTabOnPress={() => {
        //   console.log('Back to initial and also print this');
        // }}
        showLabel={true}
        tabBarStyle={styles.tabBarStyle}
        activeTintColor={colors.white}
      >
        <Scene
          initial
          key="messages"
          title="Messages"
          component={Messages}
          icon={icon('wechat')}
        />
        <Scene
          key="basket"
          title="Baskets"
          component={Home}
          icon={icon('basket')}
        />
      </Tabs>

      <Scene
        key='login'
        component={Login}
      />

    </Stack>
  </Router>