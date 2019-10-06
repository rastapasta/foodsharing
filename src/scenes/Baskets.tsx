import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, FlatList, View, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'
import { translate } from '../common/translation'
import { Basket } from '../common/typings'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  nonFound: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 12,
    padding: 30
  },
  empty: {
    height: height - 80,
    width,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {
  actions: any

  baskets: any
  isFocused: boolean
}

class Baskets extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('baskets')
  }

  async componentDidMount() {
    const { actions } = this.props
    actions.navigation('baskets')
    actions.getBaskets()
  }

  render() {
    const { baskets } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={baskets.own.map(id => baskets.baskets[id])}
          keyExtractor={(basket: Basket) => basket.id.toString()}
          renderItem={({item}) =>
            <TouchableOpacity onPress={() => Actions.push('basket', {id: item.id})}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={() =>
            <View style={styles.empty}>
              {baskets.loading ?
                <ActivityIndicator size="small" color={colors.background} /> :
                <Text style={styles.nonFound}>{translate('baskets.non_found')}</Text>
              }
            </View>
          }
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  baskets: state.baskets
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Baskets))
