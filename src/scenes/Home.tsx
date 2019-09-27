import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {}

export default class Home extends PureComponent<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
    )
  }
}
