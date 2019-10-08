import React, { PureComponent, Fragment } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withNavigationFocus } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import * as reduxActions from '../common/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { CheckBox, Button } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'

import { Actions } from 'react-native-router-flux'
import { isIphoneX } from 'react-native-iphone-x-helper'

import { translate } from '../common/translation'
import colors from '../common/colors'
import { Profile, BasketPost } from '../common/typings'

import ContactInput from '../components/ContactInput'

const validityOptions = [
  {value: 1, label: translate('baskets.only_today')},
  {value: 2, label: translate('baskets.until_tomorrow')},
  {value: 3, label: translate('baskets.three_days')},
  {value: 7, label: translate('baskets.one_week')},
  {value: 14, label: translate('baskets.two_weeks')},
  {value: 21, label: translate('baskets.three_weeks')},
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 10
  },
  content: {
    flex: 1,
    padding: 15
  },
  category: {
    fontSize: 13,
    color: colors.darkgray
  },
  checkbox: {
    marginTop: 10,
    height: 25,
    marginLeft: 0,
    paddingBottom: 0,
    paddingTop: 0,
    borderWidth: 0,
    backgroundColor: colors.white
  },
  cameraButton: {
    position: 'absolute',
    right: 10,
    bottom: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingLeft: 2
  }
})

type Props = {
  id: number
  actions: any
  isFocused: boolean

  profile: Profile,
  baskets: any
}

class EditBasket extends PureComponent<Props> {
  state: {
    picture: any
    description: string
    by_message: boolean
    by_phone: boolean

    landline: string
    mobile: string

    lifetime: number

    longitude: number
    latitude: number
  }

  refs: {
    map: MapView
  }

  constructor(props: Props) {
    super(props)
    const { profile: { landline, mobile, lat, lon }, baskets, id } = this.props
        , basket = id ? baskets.baskets[`${id}`] : null

    this.state = {
      picture: null,
      description: basket ? basket.description : '',
      by_message: false,
      by_phone: false,
      lifetime: null,

      landline,
      mobile,
      longitude: basket ? basket.lon : parseFloat(lon),
      latitude: basket ? basket.lat : parseFloat(lat)
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.isFocused === false && this.props.isFocused === true) {
      const { latitude, longitude } = this.state
        , map = this.refs.map
        , camera = await map.getCamera()
        , { actions, id } = this.props

      camera.center = {latitude, longitude}
      map.animateCamera(camera, {duration: 300})

      actions.navigation(id ? 'editBasket' : 'offerBasket', id)
    }
  }

  async componentDidMount() {
    const { actions, id } = this.props
    actions.navigation(id ? 'editBasket' : 'offerBasket', id)
  }

  render() {
    const { picture, description, by_message, by_phone, landline, mobile, lifetime, latitude, longitude } = this.state
        , { isFocused, actions, baskets, id } = this.props
        , canPublish = description.length && (id || (by_message || (by_phone && (landline || mobile))) && lifetime)
        , initialRegion = {
          longitude,
          latitude,
          longitudeDelta: 0.002,
          latitudeDelta: 0.002
        }

    const Box = ({title, checked, onPress, testID}) =>
      <View testID={testID}>
        <CheckBox
          title={title}
          checkedColor={colors.background}
          checked={checked}
          onPress={onPress}
          wrapperStyle={{margin: 0, padding: 0}}
          textStyle={{fontSize: 12}}
          containerStyle={styles.checkbox}
        />
      </View>

    return (
      <KeyboardAwareScrollView
        style={styles.container}
        testID="basketEdit.scene"
      >
        {!id &&
          <View style={{height: 240}}>
            <Image
              source={picture ? {uri: picture.uri} : require('../../assets/basket.png')}
              style={{flex: 1}}
              resizeMode="cover"
              testID="basketEdit.picture"
            />

            <TouchableOpacity
              onPress={() => Actions.push('camera', {
                callback: picture => this.setState({picture})
              })}
              style={styles.cameraButton}
              testID="basketEdit.camera"
            >
              <Icon name="camera" size={24} color={colors.white} />
            </TouchableOpacity>

            <LinearGradient
              style={styles.gradient}
              colors={[colors.transparent, colors.white]}
            />
          </View>
        }
        <View style={styles.content}>
          <Text style={styles.category}>
            {translate('baskets.description')}
          </Text>

          <TextField
            value={description}
            onChangeText={description => this.setState({description})}
            multiline
            onBlur={() => this.setState({description: description.trim()})}
            labelHeight={4}
            tintColor={colors.background}
            baseColor={colors.background}
            label=""
            inputContainerStyle={{paddingLeft: 5, paddingRight: 5}}
            fontSize={14}
            testID="basketEdit.description"
          />

          {!id &&
            <Fragment>
              <Text style={[styles.category, {marginTop: 18, marginBottom: 5}]}>
                {translate('baskets.how_contact')}
              </Text>

              <Box
                title={translate('baskets.by_message')}
                checked={by_message}
                onPress={() => this.setState({by_message: !by_message})}
                testID="basketEdit.by_message"
              />

              <Box
                title={translate('baskets.by_phone')}
                checked={by_phone}
                onPress={() => this.setState({by_phone: !by_phone})}
                testID="basketEdit.by_phone"
              />

              {by_phone &&
                <Fragment>
                  <ContactInput
                    value={mobile}
                    placeholder={translate('baskets.mobile_number')}
                    onChange={mobile => this.setState({mobile})}
                    icon="cellphone-iphone"
                    testID="basketEdit.mobile"
                  />
                  <ContactInput
                    value={landline}
                    placeholder={translate('baskets.landline_number')}
                    onChange={landline => this.setState({landline})}
                    icon="phone-classic"
                    testID="basketEdit.landline"
                  />
                </Fragment>
              }

              <Text style={[styles.category, {marginTop: 15}]}>
                {translate('baskets.how_long')}
              </Text>

              <Dropdown
                testID="basketEdit.dropdown"
                onChangeText={lifetime => this.setState({lifetime})}
                labelHeight={8}
                value={(validityOptions.find(option => option.value === lifetime) || {}).value || ''}
                tintColor={colors.background}
                baseColor={colors.background}
                dropdownOffset={{top: -120, left: 0}}
                itemCount={6}
                data={validityOptions}
                inputContainerStyle={{paddingLeft: 5}}
                fontSize={14}
              />
            </Fragment>
          }

          <Text style={[styles.category, {marginTop: 20}]}>
            {translate('baskets.where_is')}
          </Text>

          <TouchableOpacity
            style={{height: 100, marginTop: 10}}
            onPress={() => Actions.push('locationSelector', {
              callback: ({latitude, longitude}) => this.setState({latitude, longitude}),
              location: {latitude, longitude}
            })}
            testID="basketEdit.map"
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
              initialRegion={initialRegion}
              pitchEnabled={false}
              style={{flex: 1}}
            >
              {isFocused && <Marker coordinate={{longitude, latitude}} />}
            </MapView>
          </TouchableOpacity>

          <Button
            title={
              baskets.posting ? translate('baskets.publishing') :
              baskets.uploading ? translate('baskets.uploading') :
              id ? translate('baskets.save_changes') :
              translate('baskets.publish')
            }
            testID="basketEdit.submit"
            buttonStyle={{backgroundColor: colors.green}}
            titleStyle={{fontSize: 14}}
            containerStyle={{marginTop: 15}}
            disabled={!canPublish || baskets.posting || baskets.uploading}
            onPress={() => id ?
              actions.updateBasket({
                id,
                description,
                lat: latitude,
                lon: longitude
              })
            :
              actions.addBasket({
                description,
                contactTypes: [
                  ...(by_message ? [1] : []),
                  ...(by_phone ? [2] : [])
                ],
                tel: landline,
                handy: mobile,
                lifetime,
                lat: latitude,
                lon: longitude,
                picture
              } as BasketPost)}
          />
        </View>

        {isIphoneX() && <View style={{height: 32}} />}
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  baskets: state.baskets
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(EditBasket))
