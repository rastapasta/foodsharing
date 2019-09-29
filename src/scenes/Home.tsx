// TODO:  template - clean up afterwards

import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import colors from '../common/colors'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

type Props = {
  fairteiler: any
  fairteilers: any
}

class Home extends PureComponent<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
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
)(Home)
