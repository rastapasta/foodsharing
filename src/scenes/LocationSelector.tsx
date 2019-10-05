import React, { PureComponent } from 'react'
import { StyleSheet, View, Image } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import MapView from 'react-native-maps'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  staticMarker: {
    width: 30,
    height: 35,
    transform: [
      {translateX: 2},
      {translateY: -13}
    ]
  }
})

type Props = {
  onSuccess: () => void

  actions: any,
  isFocused: boolean
}

class LocationSelector extends PureComponent<Props> {
  state = {
    longitude: 10.60117067,
    latitude: 50.34470266
  }

  refs: {
    map: MapView
  }

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
    // const { longitude, latitude } = this.state

    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          onRegionChange={({longitude, latitude}) => this.setState({longitude, latitude})}
        />

        <View
          style={styles.overlay}
          pointerEvents="none"
        >
          <Image
            source={require('../../assets/marker/marker_basket.png')}
            style={styles.staticMarker}
            resizeMode="contain"
          />
        </View>
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
