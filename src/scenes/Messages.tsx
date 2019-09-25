import React, {PureComponent} from 'react'
import {SafeAreaView, StyleSheet, Text} from 'react-native'
import colors from '../colors'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {}

export default class Messages extends PureComponent<Props> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
      </SafeAreaView>
    )
  }
}
