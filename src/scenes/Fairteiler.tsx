import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import ActivityIndicator from '../components/ActivityIndicator'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'

import { Fairteiler as FairteilerType } from '../common/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
})

type Props = {
  id: number
  fairteiler: {string: FairteilerType}
  actions: any
  walls: any
}

class Fairteiler extends PureComponent<Props> {
  componentDidMount() {
    const { actions, id } = this.props
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
        <View>
          <Text>
            {data.name} - {wall ? wall.results.length + ' comments' : '0 comments'}
          </Text>
        </View>
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
)(Fairteiler)
