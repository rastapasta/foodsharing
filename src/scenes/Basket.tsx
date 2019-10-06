import React, { PureComponent } from 'react'
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import Image from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import MapView, { Marker } from 'react-native-maps'
import openMap from 'react-native-open-maps'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import ActivityIndicator from '../components/ActivityIndicator'
import RoundedImage from '../components/RoundedImage'
import { foodsaver } from '../common/placeholder'

import colors from '../common/colors'
import { Actions } from 'react-native-router-flux'
import { formatDate } from '../common/utils'
import { translate } from '../common/translation'
import config from '../common/config'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10
  },
  label: {
    color: colors.darkgray,
    width: 120
  },
  creator: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10
  },
  creatorText: {
    color: colors.darkgray
  },
  seperator: {
    height: 1,
    backgroundColor: colors.gray,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  content: {
    padding: 10
  },
  description: {
    padding: 10
  },
  gradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 10
  },
})

type Props = {
  id: number

  baskets: any
  foodsavers: any
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
    const { baskets, foodsavers, id } = this.props
    , basket = baskets.baskets[id] || {}
    , creator = foodsaver(foodsavers[`${basket.creator}`])

    if (!basket.creator)
      return <ActivityIndicator backgroundColor={colors.white} color={colors.background} />

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{flex: 1}}>
          {basket.picture &&
            <View style={{height: 200, aspectRatio: 1}}>
              <Image
                source={{uri: config.host + '/images/basket/' + basket.picture}}
                style={{width, height: 200}}
                resizeMode="cover"
              />
              <LinearGradient
                style={styles.gradient}
                colors={[colors.transparent, colors.white]}
              />
            </View>
          }
          <TouchableOpacity
            onPress={() => Actions.push('profile', {id: creator.id})}
            style={{flexDirection: 'row', padding: 10}}
          >
            <View style={{width: '17%'}}>
              <RoundedImage photo={creator.photo} />
            </View>
            <View style={styles.creator}>
              <Text style={styles.creatorText}>
                {creator.name}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.label}>
                {translate('baskets.created_at')}
              </Text>
              <Text>{formatDate(basket.createdAt * 1000)}</Text>
            </View>
            {!!basket.updatedAt && basket.updatedAt !== basket.createdAt &&
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={styles.label}>
                  {translate('baskets.updated_at')}
                </Text>
                <Text>{formatDate(basket.updatedAt * 1000)}</Text>
              </View>
            }
          </View>

          <View style={styles.seperator} />

          <View style={styles.content}>
            <Text style={styles.label}>
              {translate('baskets.description')}
            </Text>
            <Text style={styles.description}>
              {basket.description}
            </Text>
          </View>

          <View style={styles.seperator} />
          <View style={styles.content}>
            <Text style={styles.label}>
              {translate('baskets.request_basket')}
            </Text>
          </View>

          <View style={styles.seperator} />
          {basket.lat && basket.lon &&
            <TouchableOpacity
              style={styles.content}
              onPress={() =>
                openMap({
                  longitude: basket.lon,
                  latitude: basket.lat,
                  provider: Platform.OS === 'ios' ? 'apple' : 'google',
                  query: translate('baskets.creators_basket', {name: creator.name, id: basket.id})
                })
              }
            >
              <MapView
                ref="map"
                showsPointsOfInterest={false}
                showsCompass={false}
                showsScale={false}
                showsMyLocationButton={false}
                showsTraffic={false}
                showsIndoors={false}
                zoomEnabled={false}
                scrollEnabled={false}
                initialRegion={{
                  longitude: basket.lon,
                  latitude: basket.lat,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                pitchEnabled={false}
                style={{height: 120}}
              >
                <Marker coordinate={{longitude: basket.lon, latitude: basket.lat}} />
              </MapView>
            </TouchableOpacity>
          }
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers,
  baskets: state.baskets
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Basket))
