import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  label: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    paddingBottom: 3
  },
  text: {
    color: colors.drawerText
  }
})

type Props = {
  icon: string,
  label: string,
  onPress: () => void
}

export default (props: Props) =>
  <TouchableOpacity
    onPress={props.onPress}
    style={styles.container}
    testID={props.label}
  >
    <View>
      <Icon
        name={props.icon}
        size={26}
        color={colors.drawerIcon}
      />
    </View>
    <View style={styles.label}>
      <Text style={styles.text}>
        {translate(props.label)}
      </Text>
    </View>
  </TouchableOpacity>