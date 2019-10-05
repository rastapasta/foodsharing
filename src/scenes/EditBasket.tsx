import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import MapView from 'react-native-maps'

import * as reduxActions from '../common/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { CheckBox } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
import { TextField } from 'react-native-material-textfield'

import { translate } from '../common/translation'
import colors from '../common/colors'

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
  }
})

type Props = {
  id: number
  actions: any
  isFocused: boolean
}

class EditBasket extends PureComponent<Props> {
  state = {
    description: '',
    by_phone: false,
    by_message: false,
  }

  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('editBasket', id)
  }

  async componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('editBasket', id)
  }

  render() {
    const { description, by_message, by_phone } = this.state

    const Box = ({title, checked, onPress}) =>
      <CheckBox
        title={title}
        checkedColor={colors.background}
        checked={checked}
        onPress={onPress}
        wrapperStyle={{margin: 0, padding: 0}}
        textStyle={{fontSize: 12}}
        containerStyle={styles.checkbox}
      />

    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={{height: 200}}>
          <Image
            source={require('../../assets/basket.png')}
            style={{flex: 1}}
            resizeMode="cover"
          />

          <View style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.green
          }}>

          </View>

          <LinearGradient
            style={styles.gradient}
            colors={[colors.transparent, colors.white]}
          />
        </View>
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
          />

          <Text style={[styles.category, {marginTop: 18, marginBottom: 5}]}>
            {translate('baskets.how_contact')}
          </Text>

          <Box
            title={translate('baskets.by_message')}
            checked={by_message}
            onPress={() => this.setState({by_message: !by_message})}
          />

          <Box
            title={translate('baskets.by_phone')}
            checked={by_phone}
            onPress={() => this.setState({by_phone: !by_phone})}
          />


          <Text style={[styles.category, {marginTop: 15}]}>
            {translate('baskets.how_long')}
          </Text>

          <Dropdown
            // onChange={() => null}
            labelHeight={8}
            tintColor={colors.background}
            baseColor={colors.background}
            dropdownOffset={{top: -120, left: 0}}
            itemCount={6}
            data={[
              {value: 1, label: translate('baskets.only_today')},
              {value: 2, label: translate('baskets.until_tomorrow')},
              {value: 3, label: translate('baskets.three_days')},
              {value: 7, label: translate('baskets.one_week')},
              {value: 14, label: translate('baskets.two_weeks')},
              {value: 21, label: translate('baskets.three_weeks')},
            ]}
          />

          <Text style={[styles.category, {marginTop: 20}]}>
            {translate('baskets.where_is')}
          </Text>

          <TouchableOpacity style={{height: 100, marginTop: 10}}>
            <MapView
              showsPointsOfInterest={false}
              showsCompass={false}
              showsScale={false}
              showsMyLocationButton={false}
              showsTraffic={false}
              showsIndoors={false}
              zoomEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
              style={{flex: 1}}
            />
          </TouchableOpacity>
          {/* "baskets": {
    "non_found": "You have no published food baskets and there are no baskets nearby.",
    "description": "Description",
    "how_contact": "How would you like to be contacted?",
    "by_message": "By message",
    "by_phone": "By phone",
    "landline_number": "Landline number",
    "phone_number": "Phone number",
    "how_long": "How long should your basked be valid?",
    "only_today": "only today",
    "until_tomorrow": "until tomorrow",
    "three_days": "three days",
    "one_week": "one week",
    "two_weeks": "two weeks",
    "three_weeks": "three weeks"
  } */}
        </View>
      </KeyboardAwareScrollView>
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
)(withNavigationFocus(EditBasket))
