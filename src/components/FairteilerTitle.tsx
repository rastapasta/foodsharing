// TODO: Currently not used anymore (after a few iterations)
// using static title instead. Keeping for a while, then good bye :)

import React, { PureComponent } from 'react'
import { Text, StyleSheet, Platform, View } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 17,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
})

type Props = {
  id: number

  actions: any
  fairteiler: any
}

class FairteilerTitle extends PureComponent<Props> {
  render() {
    const { id, fairteiler } = this.props
        , data = fairteiler[id] || {}

    return <View
        style={styles.container}
      >
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {data.name}
        </Text>
      </View>
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
)(FairteilerTitle)
