import React from 'react'
import { StyleSheet, View, Picker, Dimensions, Platform } from 'react-native'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  picker: {
    maxHeight: 90,
    paddingLeft: Platform.OS === 'android' ? 15 : 0,
    overflow: 'hidden',
    marginTop: 5
  },
})

type Props = {
  onChange: (value: string, index: number) => void
  options: any[]
  selected: any
}

export default ({options, onChange, selected}: Props) =>
  <View style={styles.picker}>
    <Picker
      selectedValue={selected}
      itemStyle={{fontSize: 14}}
      style={[{width}, Platform.OS === 'ios' && {transform: [{translateY: -55}]}]}
      onValueChange={onChange}
    >
      {options.map(option =>
        <Picker.Item
          key={`option${option.id}`}
          label={option.name}
          value={option.id}
        />
      )}
    </Picker>
  </View>