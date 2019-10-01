import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import ParalxScrolView from '../components/ParalaxScrollView'

import { getProfile } from '../common/api'
import colors from '../common/colors'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    fontSize: 16
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
    const headerHeight = 80
        , circleSize = 55
    const circle = (label: string, value: string | number, unit?: string) =>
      <View style={{width: circleSize, height: circleSize, borderRadius: circleSize / 2, overflow: 'hidden'}}>
        <View style={{flex: 1, padding: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: '#64AE24'}}>
          <Text style={{color: colors.white}} numberOfLines={1} adjustsFontSizeToFit={true}>
            {value}{unit}
          </Text>
          <Text style={{color: colors.white, fontSize: 8}} numberOfLines={1} adjustsFontSizeToFit={true}>
            {label}
          </Text>
        </View>
      </View>

    return (
      <View style={styles.container}>
        <ParalxScrolView
          image={{uri: 'https://beta.foodsharing.de/images/ccab3b35468b3c9d726aecf67ea89f0d.jpg'}}
          imageHeight={height * 0.5}
          headerComponent={
            <View style={{height: headerHeight, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.name}>
                Tobias
              </Text>
            </View>
          }
        >
          <View style={{height, backgroundColor: 'white', marginTop: 5}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              {circle('Bananen', 26)}
              {circle('Essenskörbe', 35, 'x')}
              {circle('Beiträge', 4412)}
              {circle('abgeholt', 510, 'x')}
              {circle('gerettet', 16340, 'kg')}
            </View>
          </View>
        </ParalxScrolView>
        <TouchableOpacity
          hitSlop={{left: 5, right: 10, bottom: 10, top: 10}}
          style={{position: 'absolute', left: 0, top: 0, height: headerHeight, justifyContent: 'center'}}
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
