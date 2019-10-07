import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, FlatList, View, ActivityIndicator, Dimensions, TouchableOpacity, Platform } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'
import { translate } from '../common/translation'
import { Basket } from '../common/typings'
import { Actions } from 'react-native-router-flux'
import { formatDate } from '../common/utils'

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
  },
  item: {
    backgroundColor: colors.white,
    padding: 8,
    borderColor: colors.gray,
    borderBottomWidth: 1,
    minHeight: 70
  },
  title: {
    fontSize: 12,
    color: colors.darkgray
  },
  time: {
    fontSize: 12,
    color: colors.darkgray
  },
  description: {
    marginTop: 10
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})

type Props = {
  actions: any

  baskets: any
  isFocused: boolean
}

class Baskets extends PureComponent<Props> {
  state = {
    refreshing: false
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('baskets')
  }

  async componentDidMount() {
    const { actions } = this.props
    actions.navigation('baskets')
    actions.fetchBaskets()
  }

  render() {
    const { baskets, actions } = this.props
        , { refreshing } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          onRefresh={Platform.OS === 'ios' ? () => {
            actions.fetchBaskets()
            setTimeout(() => this.setState({refreshing: false}), 1000)
          } : null}
          refreshing={refreshing}

          style={{flex: 1}}
          data={baskets.own.map(id => baskets.baskets[id])}
          keyExtractor={(basket: Basket) => basket.id.toString()}
          renderItem={({item}) =>
            <TouchableOpacity
              onPress={() => Actions.push('basket', {id: item.id})}
              style={styles.item}
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {translate('baskets.my_basket')}
                </Text>
                <Text style={styles.time}>
                  {formatDate(item.createdAt * 1000)}
                </Text>
              </View>

              <Text
                style={styles.description}
                numberOfLines={3}
              >
                {item.description}
              </Text>
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
