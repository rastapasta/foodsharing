import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent, Fragment } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import Image from 'react-native-fast-image'

import ParalxScrolView from '../components/ParalaxScrollView'
import ProfileCircle from '../components/ProfileCircle'

import { foodsaver } from '../common/placeholder'
import BackButton from '../components/BackButton'
import colors from '../common/colors'

import { Actions } from 'react-native-router-flux'
import { translate } from '../common/translation'

const { width, height } = Dimensions.get('window')

const avatar = 'https://foodsharing.de/img/130_q_avatar.png'
    , hat = 'https://beta.foodsharing.de/img/sleep130x130.png'
    , circles = [
      {name: 'bananacount', unit: ''},
      {name: 'basketcount', unit: ''},
      {name: 'postcount', unit: ''},
      {name: 'fetchcount', unit: 'x'},
      {name: 'fetchweight', unit: 'kg'}
    ]

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Alfa Slab One'
  },
  nameContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleBar: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    padding: 6,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.profileButton
  },
  header: {
    width,
    backgroundColor: colors.background,
    paddingTop: isIphoneX() ? 30 : 14,
  },
  category: {
    color: colors.profileCategory,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Alfa Slab One'
  },
  hat: {
    width: 40,
    height: 40,
    position: 'absolute',
    aspectRatio: 1,
    left: 0,
    transform: [
      {translateY: -35},
      {translateX: -25}
    ]
  }
})

type Props = {
  id: number

  foodsavers: any
  profile: any
  actions: any
  isFocused: boolean
}

class Profile extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('profile', id)
  }

  async componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('profile', id)
    actions.fetchProfile(id)
  }

  render() {
    const { id, foodsavers, actions, profile: user } = this.props
        , profile = foodsaver(foodsavers[`${id}`])
        , hasStats = profile.stats && !Object.keys(profile.stats).every(stat => profile.stats[stat] === 0)
        , headerHeight = (isIphoneX() ? 155 : 125) - (!hasStats && !profile.loading ? 65 : 0)

    const Button = ({icon, label, color, onPress, disabled, loading}) =>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ?
          <View style={{width: 28, height: 28, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="small" color={color} />
          </View> :
          <Icon name={icon} size={26} color={color}/>
        }
        <Text style={[styles.buttonText, {color}]}>{label}</Text>
      </TouchableOpacity>

    return (
      <View style={styles.container} testID='profile.scene'>
        <ParalxScrolView
          image={{uri: profile.photo ? 'https://foodsharing.de/images/' + profile.photo : avatar}}
          imageHeight={height * 0.5}
          headerHeight={headerHeight}
          headerComponent={
            <View style={[styles.header, {height: headerHeight}]} pointerEvents='box-none'>
              <View style={styles.nameContainer} pointerEvents='none'>
                <Text style={styles.name} testID="profile.name">
                  {!!profile.sleepStatus &&
                    <View style={styles.hat}>
                      <Image source={{uri: hat}} style={{flex: 1}} resizeMode="contain" />
                    </View>
                  }
                  {profile.name}
                </Text>
              </View>
              <View style={styles.circleBar} pointerEvents='box-none'>
                {profile.loading && !hasStats && <View style={{justifyContent: 'center', height: 50}}><ActivityIndicator size="small" color={colors.white} /></View>}
                {hasStats && circles.map(circle =>
                  !!profile.stats[circle.name] &&
                  <ProfileCircle
                    onPress={circle.name === 'bananacount' ? () => Actions.push('bananas', {id: profile.id}): null}
                    key={'circle' + circle.name}
                    label={circle.name}
                    value={profile.stats[circle.name]}
                    unit={circle.unit}
                  />
                )}
              </View>
            </View>
          }
        >
          <View style={{minHeight: height - (Platform.OS === 'ios' ? headerHeight : headerHeight +  24), backgroundColor: colors.white, marginTop: 5, padding: 20}}>
            {user.id !== profile.id &&
              <View style={{flexDirection: 'row', marginBottom: 10, justifyContent: 'space-evenly'}}>
                <Button
                  label={translate(profile.isFriend ? 'profile.you_know_person' : 'profile.i_know_person', {name: profile.name})}
                  icon={profile.isFriend ?  'account-check-outline' : 'account-plus-outline'}
                  color={profile.isFriend ? colors.profileButtonFriend : colors.profileButton}
                  onPress={() => actions.requestFriendship(profile.id)}
                  disabled={!!profile.isFriend}
                  loading={profile.friendrequestLoading}
                />
                <Button
                  label={translate('profile.write_message')}
                  icon="message-text-outline"
                  onPress={() => actions.fetchConversationId(profile.id)}
                  color={colors.profileButton}
                  disabled={false}
                  loading={profile.conversationIdLoading}
                />
                <Button
                  label={translate(profile.reported && !profile.reportSending ? 'profile.reported' : 'profile.report_violation')}
                  icon={profile.reported ? 'shield-check-outline' : 'alert-decagram-outline'}
                  onPress={() => Actions.push('report', {id: profile.id})}
                  color={profile.reported ? colors.green : colors.profileButton}
                  disabled={false}
                  loading={profile.reportSending}
                />
              </View>
            }

            {profile.infos && profile.infos.length > 0 &&
              <Fragment>
                <Text style={styles.category}>
                  Infos
                </Text>
                {profile.infos.map(info =>
                  <View style={{marginTop: 10}} key={info.title}>
                    <Text style={{fontWeight: 'bold'}}>
                      {
                        info.title
                        .replace(new RegExp(`( von )*${profile.name}( ist | hat eine )*`), '')
                        .replace(/^(Er|Sie|Er\/Sie) ist /, '')
                      }
                    </Text>
                    <Text style={{fontSize: 12, marginTop: 4}}>{info.body}</Text>
                  </View>
                )}
              </Fragment>
            }
          </View>
        </ParalxScrolView>
        <BackButton />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Profile))
