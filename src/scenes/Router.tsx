import React from 'react'
import { StyleSheet } from 'react-native'
import { Scene, Router, Stack, Tabs, Drawer as RouterDrawer } from 'react-native-router-flux'
import colors from '../common/colors'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Login from './Login'
import Conversations from './Conversations'
import Conversation from './Conversation'
import Home from './Home'
import Drawer from '../components/Drawer'

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
      tintColor={colors.white}
      key='root'
      navigationBarStyle={{ backgroundColor: colors.background }}
      hideNavBar
    >
      <Scene
        initial
        key="login"
        component={Login}
      />
      <RouterDrawer
        hideNavBar
        key="drawer"
        onExit={() => {
          console.log('Drawer closed');
        }}
        onEnter={() => {
          console.log('Drawer opened');
        }}
        contentComponent={Drawer}
        // drawerImage={() => <Icon name=}
        drawerWidth={240}
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
      </RouterDrawer>
      <Scene
        key="conversation"
        title="Conversation"
        component={Conversation}
        hideNavBar={false}
      />
    </Stack>
  </Router>