import React from 'react'
import { StyleSheet } from 'react-native'
import { Scene, Router, Stack, Tabs, Drawer as RouterDrawer } from 'react-native-router-flux'
import colors from '../common/colors'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Drawer from '../components/Drawer'

import Login from './Login'
import Map from './Map'
import Conversations from './Conversations'
import Conversation from './Conversation'
import Home from './Home'
import Fairteiler from './Fairteiler'
import Loading from './Loading'

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
        key="loading"
        component={Loading}
      />
      <Scene
        key="login"
        component={Login}
      />
      <RouterDrawer
        hideNavBar
        key="drawer"
        contentComponent={Drawer}
        drawerWidth={240}
      >
        <Tabs
          key="main"
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
          <Scene
              key="map"
              title="Map"
              component={Map}
              icon={icon('map-marker')}
            />
        </Tabs>
      </RouterDrawer>
      <Scene
        key="conversation"
        title="Conversation"
        component={Conversation}
        hideNavBar={false}
      />
      <Scene
        key="fairteiler"
        title="Fairteiler"
        component={Fairteiler}
        hideNavBar={false}
      />
    </Stack>
  </Router>