import React, { PureComponent } from 'react'
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native'
import { withNavigationFocus } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import RoundedImage from '../components/RoundedImage'
import { foodsaver } from '../common/placeholder'

import colors from '../common/colors'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10
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

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => Actions.push('profile', {id: creator.id})}
          style={{flexDirection: 'row'}}
        >
          <View style={{width: '20%', padding: 5}}>
            <RoundedImage photo={creator.photo} />
          </View>
          <View style={{flex: 1, justifyContent: 'center', paddingLeft: 5}}>
            <Text>{creator.name}</Text>
          </View>
        </TouchableOpacity>
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
