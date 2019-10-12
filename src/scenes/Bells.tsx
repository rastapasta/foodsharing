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
import { Bell } from '../common/typings'

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
  bells: Bell[]
  actions?: any
  isFocused: boolean
}

class Bells extends Component<Props> {
  state = {
    refreshing: false
  }

  shouldComponentUpdate(next: Props) {
    const { bells } = this.props
    return (next.bells || []).length !== (bells || []).length
          || (next.bells.length && !next.bells.every(
              (bell, idx) => bells[idx].isRead !== bell.isRead
              || bells[idx].deleting !== bell.deleting
          ))
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('bells')
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('bells')
    actions.fetchBells()
  }

  render() {
    const { bells, actions } = this.props
        , { refreshing } = this.state

    return (
      <SafeAreaView style={styles.container} testID="bells.scene">
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
        {bells.length ?
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
            data={bells as Bell[]}
            renderItem={({item, index}) =>
              <View style={{backgroundColor: colors.white}}>
                <CommonListEntry
                  testID={'bells.'+item.id}
                  isLast={index === bells.length - 1}
                  title={translate(`bells.${item.key}_title`, item.payload)}
                  subtitle={translate(`bells.${item.key}`, item.payload)}
                  onPress={async () => {
                    try {
                      await Linking.openURL(config.host + item.href)
                      actions.markBell(item.id)
                    } catch(e) {
                      console.log(e)
                    }
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
              {translate('bells.no_bells')}
            </Text>
          </View>
      }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  bells: state.bells
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Bells))
