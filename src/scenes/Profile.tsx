import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import ParalxScrolView from '../components/ParalaxScrollView'
import ProfileCircle from '../components/ProfileCircle'

import { getProfile } from '../common/api'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    fontSize: 16,
  }
})

type Props = {
  id: number

  actions: any
  isFocused: boolean
}

class Profile extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('profile')
  }

  async componentDidMount() {
    const { actions } = this.props
    actions.navigation('profile')

    console.log(await getProfile(338242))
  }

  render() {
    const headerHeight = 130

    return (
      <View style={styles.container}>
        <ParalxScrolView
          image={{uri: 'https://beta.foodsharing.de/images/ccab3b35468b3c9d726aecf67ea89f0d.jpg'}}
          imageHeight={height * 0.5}
          headerComponent={
            <View style={{
              height: headerHeight,
              width,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{height: 40, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.name}>
                  Tobias
                </Text>
              </View>
              <View style={{
                width,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
                <ProfileCircle label="bananacount" value={26} unit="" />
                <ProfileCircle label="basketcount" value={35} unit="x" />
                <ProfileCircle label="postcount" value={4412} unit="" />
                <ProfileCircle label="fetchcount" value={510} unit="x" />
                <ProfileCircle label="fetchweight" value={16340} unit="kg" />
              </View>
            </View>
          }
        >
          <View style={{height: height/2, backgroundColor: 'white', marginTop: 5}} />
        </ParalxScrolView>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          hitSlop={{left: 5, right: 10, bottom: 10, top: 10}}
          style={{position: 'absolute', left: 0, top: 20, justifyContent: 'center'}}
        >
          <Icon name="chevron-left" size={36} color="#000" />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Profile))
