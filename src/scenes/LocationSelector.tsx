import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import MapView from 'react-native-maps'

const MAIN_REGION = {
        longitude: 10.60117067,
        latitude: 50.34470266,
        longitudeDelta: 1.1,
        latitudeDelta: 1.1
      }

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
})

type Props = {
  onSuccess: () => void

  actions: any,
  isFocused: boolean
}

class LocationSelector extends PureComponent<Props> {
  componentDidMount() {
    const { actions } = this.props
    actions.navigation('locationSelector')
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('locationSelector')
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{flex: 1}}
        />
      </View>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationSelector)
