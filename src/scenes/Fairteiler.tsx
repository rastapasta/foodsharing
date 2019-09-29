import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, View, Text } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { Fairteiler as FairteilerType } from '../common/api'
import colors from '../common/colors'

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
}

class Fairteiler extends PureComponent<Props> {
  componentDidMount() {
    const { actions, id } = this.props
    actions.fetchFairteiler(id)
  }
  render() {
    const {id, fairteiler} = this.props
        , data = fairteiler[id] || null

    return (
      <SafeAreaView style={styles.container}>
        {data &&
          <View>
            <Text>
              {data.name}
            </Text>
          </View>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  fairteiler: state.fairteiler
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fairteiler)
