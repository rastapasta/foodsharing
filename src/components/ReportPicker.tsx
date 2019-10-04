import React from 'react'
import { StyleSheet, Text, View, Picker, Dimensions, Platform } from 'react-native'
import { pickTranslation } from '../common/translation'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  category: {
    fontWeight: 'bold',
    fontSize: 12,
    width,
    marginTop: 20,
    paddingLeft: 20
  },
  picker: {
    maxHeight: 90,
    paddingLeft: Platform.OS === 'android' ? 15 : 0,
    overflow: 'hidden',
    marginTop: 5
  },
})

type Props = {
  label?: string
  onChange: (value: string, index: number) => void
  reasons: any[]
  selected: any
}

export default ({label, onChange, reasons, selected}: Props) =>
  <View>
    {!!label &&
      <Text style={styles.category}>
        {label}
      </Text>
    }
    <View style={styles.picker}>
      <Picker
        selectedValue={selected}
        itemStyle={{fontSize: 14}}
        style={[{width}, Platform.OS === 'ios' && {transform: [{translateY: -55}]}]}
        onValueChange={onChange}
      >
        {reasons.map(reason =>
          <Picker.Item
            key={`reason${reason.id}`}
            label={pickTranslation(reason)}
            value={reason.id}
          />
        )}
      </Picker>
    </View>
  </View>