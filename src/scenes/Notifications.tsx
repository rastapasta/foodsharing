import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity, Linking } from 'react-native'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SwipeListView } from 'react-native-swipe-list-view'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import CommonListEntry from '../components/CommonListEntry'
import { withNavigationFocus } from 'react-navigation'

import { translate } from '../common/translation'
import moment from 'moment'
import config from '../common/config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    flex: 1
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: (60-32)/2
  }
})

type Props = {
  notifications: Notifications[],
  actions?: any
  app: any
  isFocused: boolean
}

class Notifications extends Component<Props> {
  state = {
    refreshing: false
  }

  shouldComponentUpdate(next: Props) {
    const { notifications } = this.props
    return (next.notifications || []).length !== (notifications || []).length
        || true // for now
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('notifications')
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('notificiations')
    actions.fetchBells()
  }

  render() {
    const { notifications, actions, app } = this.props
        , data = [{"id":2662970,"key":"buddy_request","href":"\/profile\/341047","payload":{"name":"Paul"},"icon":null,"image":"\/img\/mini_q_avatar.png","createdAt":"2019-10-10T14:06:11","isRead":false,"isCloseable":true},{"id":2659662,"key":"store_request_accept","href":"\/?page=fsbetrieb&id=14997","payload":{"user":"Julian","name":"Z - BEtrieb doppelt angelegt"},"icon":"img img-store brown","image":null,"createdAt":"2019-10-09T20:18:39","isRead":true,"isCloseable":true},{"id":2618694,"key":"store_request_accept","href":"\/?page=fsbetrieb&id=17735","payload":{"user":"Margot","name":"Betrieb f\u00fcr alle NEULINGE"},"icon":"img img-store brown","image":null,"createdAt":"2019-10-01T12:51:36","isRead":true,"isCloseable":true}]
        , { refreshing } = this.state

    return (
      <SafeAreaView style={styles.container} testID="conversations.scene">
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
        {data.length ?
          <SwipeListView
            rightOpenValue={-60}
            renderHiddenItem={(data) =>
              <TouchableOpacity
                style={[styles.swipeContainer, !data.item.isRead && {backgroundColor: colors.messageUnreadBackground}]}
                onPress={() => actions.deleteBell(data.item.id)}
              >
                <Icon name="trash-can-outline" size={32} color={colors.background} />
              </TouchableOpacity>
            }
            keyExtractor={item => item.id.toString()}
            onRefresh={() => {
              actions.fetchBells()
              setTimeout(() => this.setState({refreshing: false}), 1000)
            }}
            refreshing={refreshing}
            style={styles.list}
            data={data}
            renderItem={({item, index}) =>
              <View style={{backgroundColor: colors.white}}>
                <CommonListEntry
                  testID={'notifications.'+item.id}
                  isLast={index === data.length - 1}
                  title={translate(`notifications.${item.key}_title`, item.payload)}
                  subtitle={translate(`notifications.${item.key}`, item.payload)}
                  onPress={async () => {
                    try {
                      await Linking.openURL(config.host + item.href + '&PHPSESSID=' + app.session)
                      actions.markBell(item.id)
                    } catch(e) {}
                  }}
                  isUnread={!item.isRead}
                  pictures={item.image ? [item.image.match(/mini_q_avatar/) ? null : item.image] : null}
                  icon={config.notificationIcons[item.key]}
                  displayTimeAgo
                  timestamp={moment(item.createdAt)}
                />
              </View>
            }
          />
        : <View style={{padding: 10}}>
            <Text style={{textAlign: 'center'}}>
              {translate('notifications.no_notifications')}
            </Text>
          </View>
      }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations,
  app: state.app
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Notifications))
