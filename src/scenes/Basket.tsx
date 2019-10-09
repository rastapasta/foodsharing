import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform, ActivityIndicator as Indicator } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import Image from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import MapView, { Marker } from 'react-native-maps'
import openMap from 'react-native-open-maps'
import { Button } from 'react-native-elements'
import call from 'react-native-phone-call'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import RoundedImage from '../components/RoundedImage'
import { foodsaver } from '../common/placeholder'
import ActivityIndicator from '../components/ActivityIndicator'

import colors from '../common/colors'
import { Actions } from 'react-native-router-flux'
import { translate } from '../common/translation'
import config from '../common/config'
import { isIphoneX } from 'react-native-iphone-x-helper'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  label: {
    color: colors.darkgray,
    width: 120,
    fontSize: 13
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
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,

  },
  gradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 10
  },
  button: {
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    flex: 1
  }
})

type Props = {
  id: number

  baskets: any
  foodsavers: any
  actions: any
  profile: any
  isFocused: boolean
}

class Basket extends PureComponent<Props> {
  refs: {
    map: MapView
  }

  async componentDidUpdate(prevProps: Props) {
    const { actions, id, baskets } = this.props
        , { map } = this.refs
    if (prevProps.isFocused === false && this.props.isFocused === true) {
      actions.navigation('basket', id)

      const basket = baskets.baskets[id] || {}
      const camera = await map.getCamera()
      camera.center = {latitude: basket.lat, longitude: basket.lon}
      map.animateCamera(camera, {duration: 300})
    }
  }

  async componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('basket', id)
    actions.fetchBasket(id)
  }

  render() {
    const { baskets, foodsavers, id, actions, profile } = this.props
        , basket = baskets.baskets[id] || {}
        , creator = foodsaver(foodsavers[`${basket.creator}`])
        , ownBasket = basket.creator == profile.id

        , ManageButton = ({title, onPress, color, loading, testID}: {title: string, onPress: () => void, color?: string, loading?: boolean, testID: string}) =>
            <Button
              title={title}
              testID={testID}
              containerStyle={styles.button}
              buttonStyle={{backgroundColor: color || colors.green}}
              titleStyle={{fontSize: 14}}
              onPress={onPress}
              loading={loading}
            />

    if (!basket.creator)
      return <ActivityIndicator backgroundColor={colors.white} color={colors.background} />

    return (
      <ScrollView style={styles.container} testID="basket.scene">
        <View style={{minHeight: height - 64 - (Platform.OS === 'android' ? 32 : isIphoneX() ? 22 : 0)}}>
          {!!basket.picture &&
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
            testID="basket.creator"
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
              <Text>{moment(basket.createdAt * 1000).fromNow()}</Text>
            </View>
          </View>

          <View style={styles.seperator} />

          <View style={styles.content}>
            <Text style={styles.label}>
              {translate('baskets.description')}
            </Text>
            <Text style={styles.description} testID="basket.description">
              {basket.description.trim()}
            </Text>
          </View>

          <View style={styles.seperator} />
          <View style={styles.content}>
            <Text style={styles.label}>
              {translate(ownBasket ? 'baskets.manage_basket' : 'baskets.request_basket')}
            </Text>
            {ownBasket ?
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <ManageButton
                  testID="basket.edit"
                  title={translate('baskets.edit_basket')}
                  onPress={() => Actions.push('editBasket', {id: basket.id})}
                />
                {baskets.deleting ?
                  <View style={{...styles.button, alignItems: 'center', justifyContent: 'center'}}>
                    <Indicator color={colors.background} size="small" />
                  </View>
                :
                  <ManageButton
                    testID="basket.delete"
                    title={translate('baskets.delete_basket')}
                    onPress={() => actions.deleteBasket(basket.id)}
                    color={colors.deleteButton}
                    loading={baskets.deleting}
                  />
                }
              </View>
            :
              <View style={{flexDirection: 'row'}}>
                {basket.contactTypes.includes(1) &&
                  <ManageButton
                    testID="basket.message"
                    title={translate('baskets.write_message')}
                    onPress={() => actions.fetchConversationId(creator.id)}
                  />
                }
                {basket.contactTypes.includes(2) &&
                  <ManageButton
                    testID="basket.call"
                    title={translate('baskets.call', {name: creator.name})}
                    onPress={async () => await call({
                      prompt: true,
                      number: basket.handy || basket.tel
                    })}
                  />
                }
              </View>
            }
          </View>

          <View style={styles.seperator} />
          {basket.lat && basket.lon &&
            <TouchableOpacity
              style={[styles.content, {flex: 1, minHeight: 120}]}
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
                style={{...StyleSheet.absoluteFillObject}}
              >
                <Marker coordinate={{longitude: basket.lon, latitude: basket.lat}} />
              </MapView>
            </TouchableOpacity>
          }
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers,
  baskets: state.baskets,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Basket))
