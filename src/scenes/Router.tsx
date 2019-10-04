import React from 'react'
import { StyleSheet } from 'react-native'
import { Scene, Router, Stack, Tabs, Drawer as RouterDrawer } from 'react-native-router-flux'
import colors from '../common/colors'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Drawer from '../components/Drawer'

import Login from './Login'
import Map from './Map'
import Profile from './Profile'
import Report from './Report'
import Bananas from './Bananas'
import Baskets from './Baskets'
import Conversations from './Conversations'
import Conversation from './Conversation'
import ConversationMembers from './ConversationMembers'

import ConversationTitle from '../components/ConversationTitle'
// import FairteilerTitle from '../components/FairteilerTitle'

import Fairteiler from './Fairteiler'
import Loading from './Loading'
import { translate } from '../common/translation'
import ShareButton from '../components/ShareButton'

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.background,
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#fff',
  }
})

const icon = (name: string, size: number = 32) => ({focused}) =>
    <Icon name={name} size={size} style={{marginTop: 3, color: focused ? colors.white : colors.gray}}/>

export default () =>
  <Router uriPrefix="foodsharing.de">
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
        drawerIcon={icon('menu', 26)}
        drawerWidth={240}
      >
        <Tabs
          key="main"
          showLabel={false}
          tabBarStyle={styles.tabBarStyle}
          activeTintColor="#D7CCC8"
          inactiveTintColor="#9E837A"
        >
          <Scene
            icon={icon('wechat')}
            key="conversations"
            title={translate('scenes.conversations')}
            component={Conversations}
          />
          <Scene
            key="baskets"
            title={translate('scenes.baskets')}
            component={Baskets}
            icon={icon('basket')}

          />
          <Scene
              key="map"
              title={translate('scenes.map')}
              component={Map}
              icon={icon('map-marker')}
            />
        </Tabs>
      </RouterDrawer>
      <Scene
        key="conversation"
        renderTitle={({conversationId}) => <ConversationTitle conversationId={conversationId} />}
        component={Conversation}
        hideNavBar={false}
      />
      <Scene
        key="fairteiler"
        title={translate('scenes.fairteiler')}
        component={Fairteiler}
        hideNavBar={false}
        renderRightButton={({id}) =>
          <ShareButton
            title={translate('fairteiler.share')}
            url={`https://foodsharing.de/?page=fairteiler&sub=ft&id=${id}`}
          />
        }

        // renderTitle={({id}) => <FairteilerTitle id={id} />}
        // path="/?page=fairteiler&sub=ft&id=:id"
      />
      <Scene
        key="profile"
        title={translate('scenes.profile')}
        component={Profile}
        hideNavBar
      />
      <Scene
        key="groupchat"
        renderTitle={({conversationId}) =>
          <ConversationTitle conversationId={conversationId} showCount />
        }
        component={ConversationMembers}
        hideNavBar={false}
      />
      <Scene
        key="bananas"
        title={translate('scenes.bananas')}
        component={Bananas}
        hideNavBar={false}
      />
      <Scene
        key="report"
        title={translate('scenes.report_violation')}
        component={Report}
        hideNavBar={false}
      />
    </Stack>
  </Router>