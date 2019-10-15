import React, { PureComponent, Fragment } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native'

import moment, { Moment } from 'moment'

import RoundedImage from './RoundedImage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../common/colors'
import { translate } from '../common/translation'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    width,
    height: width * 0.19 + 10,
    flexDirection: 'row'
  },
  lastMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  images: {
    width: width * 0.22,
    flexWrap: 'wrap',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3
  },
  name: {
    fontSize: 14,
    fontWeight: '400'
  },
  date: {
    color: colors.conversationDate,
    fontSize: 11
  },
  lastMessageImage: {
    width: 18,
    marginRight: 8
  },
  lastMessageText: {
    fontSize: 11,
    flex: 1,
    color: colors.messagePreview
  },
  seperator: {
    height: 1,
    width: width * 0.78 - 10,
    backgroundColor: colors.lightgray,
    position: 'absolute',
    right: 0,
    bottom: 1
  }
})

type Props = {
  onPress: () => void
  onLongPress?: () => void
  testID: string
  timestamp: number | Moment,
  isUnread: boolean,
  pictures?: string[],
  icon?: string,
  title: string,
  displayTimeAgo?: boolean
  isLast: boolean
  subtitle: string
  subtitlePhoto?: string
}

export default class ConversationsItem extends PureComponent<Props> {
  render() {
    const { onPress, onLongPress, testID, timestamp, icon, isUnread, pictures, title, displayTimeAgo, subtitlePhoto, isLast, subtitle } = this.props
        , date = (timestamp instanceof moment ? timestamp : moment(timestamp)) as Moment
        , isToday = date.isSame(new Date(), 'day')
        , isYesterday = date.isSame(new Date(Date.now() - 24*60*60*1000), 'day')

    return (
      <Fragment>
        <TouchableOpacity
          style={[styles.container, isUnread && {backgroundColor: colors.messageUnreadBackground}]}
          onPress={onPress}
          onLongPress={onLongPress}
          testID={testID}
        >
          <View style={styles.images}>
            {!!pictures && pictures.slice(0, Platform.OS === 'ios' ? 4 : 2).map((picture, idx) =>
              <RoundedImage
                key={`${testID}.${idx}`}
                style={pictures.length > 1 ? {width: '48%', margin: '1%'} : {width: '100%'}}
                photo={picture}
              />
            )}
            {!!icon &&
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={icon} size={36} color={colors.background} />
              </View>
            }
          </View>

          <View style={{flex: 1, padding: 10}}>
            <View style={styles.header}>
              <View style={{flex: 1}}>
                <Text
                  numberOfLines={1}
                  style={[styles.name, isUnread && {color: colors.messageUnread}]}
                >
                  {title}
                </Text>
              </View>
              <View>
                <Text style={[styles.date, isUnread && {color: colors.messageUnread}]}>
                  {!!displayTimeAgo ? date.fromNow() :
                    isYesterday ? translate('conversations.yesterday') :
                    isToday ? date.format('HH:mm') :
                    date.format('LL').split(/,* \d{4}$/)[0]
                  }
                </Text>
              </View>
            </View>

            <View style={[styles.lastMessage]}>
              {!!subtitlePhoto &&
                <View style={styles.lastMessageImage}>
                  <RoundedImage photo={subtitlePhoto} />
                </View>
              }
              <Text
                style={[styles.lastMessageText, isUnread && {fontWeight: 'bold'}]}
                numberOfLines={1}
                ellipsizeMode="tail"
                testID={testID + '.last'}
              >
                {subtitle}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {!isLast &&
          <View style={styles.seperator} />
        }
      </Fragment>
    )
  }
}