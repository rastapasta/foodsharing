import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import ActivityIndicator from '../components/ActivityIndicator'
import { withNavigationFocus } from 'react-navigation'
import Image from 'react-native-fast-image'
import Hyperlink from 'react-native-hyperlink'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { Fairteiler as FairteilerType } from '../common/typings'
import colors from '../common/colors'
import config from '../common/config'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  box: {
    padding: 10
  },
  headline: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
  },
  seperator: {
    backgroundColor: colors.gray,
    height: 1,
    marginLeft: 10,
    marginRight: 10
  }
})

type Props = {
  id: number
  fairteiler: {string: FairteilerType}
  actions: any
  walls: any
  isFocused: boolean
}

class Fairteiler extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('fairteiler', id)
  }

  componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('fairteiler', id)
    actions.fetchFairteiler(id)

    actions.fetchWall('fairteiler', id)
  }

  render() {
    const { id, fairteiler, walls } = this.props
        , wall = walls.fairteiler[`${id}`] || null
        , data = fairteiler[id] || null

    if (!data)
      return <ActivityIndicator backgroundColor={colors.white} color={colors.background} />

    return (
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.box}>
            <Text style={styles.headline}>{data.name}</Text>
            <Text style={styles.text}>
              {data.address}{'\n'}
              {data.postcode} {data.city}
            </Text>
          </View>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>mini map placeholder</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.seperator} />
        {!!data.picture &&
          <Image
            source={{uri: config.host + '/images/' + data.picture}}
            style={{height: 200}}
            resizeMode="cover"
          />
        }
        <View style={styles.box}>
          <Hyperlink linkDefault linkStyle={{color: colors.green}}>
            <Text style={styles.text}>
              {data.description}
            </Text>
          </Hyperlink>
        </View>
        <Text>{JSON.stringify(data)}</Text>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  fairteiler: state.fairteiler,
  walls: state.walls
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Fairteiler))
