import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import ParalxScrolView from '../components/ParalaxScrollView'
import ProfileCircle from '../components/ProfileCircle'

import { foodsaver } from '../common/placeholder'
import BackButton from '../components/BackButton'
import colors from '../common/colors'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  name: {
    color: colors.white,
    fontSize: 16
  }
})

type Props = {
  id: number

  foodsavers: any
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
    const headerHeight = isIphoneX() ? 160 : 130
        , { id, foodsavers } = this.props
        , profile = foodsaver(foodsavers[`${id}`])
    console.log(profile)
    return (
      <View style={styles.container}>
        <ParalxScrolView
          image={profile.photo ? {uri: 'https://foodsharing.de/images/' + profile.photo} : null}
          imageHeight={profile.photo ? height * 0.5 : 1}
          headerComponent={
            <View style={{
              height: headerHeight,
              width,
              backgroundColor: colors.background,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.name}>
                  {profile.name}
                </Text>
              </View>
              <View style={{
                width,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
                <ProfileCircle label="bananacount" value={26} unit="" />
                <ProfileCircle label="basketcount" value={35} unit="" />
                <ProfileCircle label="postcount" value={4412} unit="" />
                <ProfileCircle label="fetchcount" value={510} unit="x" />
                <ProfileCircle label="fetchweight" value={16340} unit="kg" />
              </View>
            </View>
          }
        >
          <View style={{minHeight: height - headerHeight, backgroundColor: colors.background, marginTop: 5}} />
        </ParalxScrolView>
        <BackButton />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Profile))
