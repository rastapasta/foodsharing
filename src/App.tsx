import React from 'react'
import { StyleSheet } from 'react-native'
import { Scene, Router, Stack, Tabs } from 'react-native-router-flux'
import colors from './colors'
import Store from './store'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Login from './scenes/Login'
import Conversations from './scenes/Conversations'
import Conversation from './scenes/Conversation'
import Home from './scenes/Home'

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.background,
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#fff',
  }
})

console.log(Store)

const icon = (name: string) =>
  () => <Icon name={name} size={32} style={{marginTop: 3, color: colors.white}}/>

export default () =>
  <Router>
    <Stack
      tintColor={colors.white}
      key='root'
      navigationBarStyle={{ backgroundColor: colors.background }}
      hideNavBar
    >
      <Tabs
        key="main"
        // onTabOnPress={() => {
        //   console.log('Back to initial and also print this');
        // }}
        showLabel={true}
        tabBarStyle={styles.tabBarStyle}
        activeTintColor="#D7CCC8"
        inactiveTintColor="#9E837A"
      >
        <Scene
          initial
          icon={icon('wechat')}
          key="conversations"
          title="Conversations"
          component={Conversations}
        />
        <Scene
          key="basket"
          title="Baskets"
          component={Home}
          icon={icon('basket')}
        />
      </Tabs>
      <Scene
        key="conversation"
        title="Conversation"
        component={Conversation}
        hideNavBar={false}
      />
      <Scene
        key='login'
        component={Login}
      />

    </Stack>
  </Router>