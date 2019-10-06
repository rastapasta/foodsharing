import React, { PureComponent } from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { withNavigationFocus } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
})

type Props = {
  id: number

  baskets: any
  actions: any
  isFocused: boolean
}

class Basket extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('basket', id)
  }

  componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('basket', id)
    actions.fetchBasket(id)
  }

  render() {
    const { baskets } = this.props

    return (
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  fairteiler: state.fairteiler,
  baskets: state.baskets
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Basket))
