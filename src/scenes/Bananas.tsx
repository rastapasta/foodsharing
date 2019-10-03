import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import { withNavigationFocus } from 'react-navigation'

import MessageBubble from '../components/MessageBubble'

import colors from '../common/colors'
import { foodsaver } from '../common/placeholder'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
})

type Props = {
  id: number

  isFocused: boolean
  foodsavers: any
  actions: any
}

class Bananas extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('bananas', id)
  }

  componentDidMount() {
    const { id, actions } = this.props
    actions.navigation('bananas', id)
  }

  render() {
    const { foodsavers, id } = this.props
        , profile = foodsaver(foodsavers[`${id}`])

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={profile.bananas}
          keyExtractor={(banana: any) => 'banana.' + banana.fs_id}
          style={{flex: 1}}
          ListHeaderComponent={() => <View style={{height: 20}} />}
          renderItem={({item}) =>
            <MessageBubble rawTime type="received" message={item} />
          }
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  foodsavers: state.foodsavers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Bananas))
