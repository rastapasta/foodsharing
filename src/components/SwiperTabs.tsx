import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native'
import colors from '../common/colors'

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  tabLabel: {
    fontFamily: 'Alfa Slab One',
    fontSize: 13,
    color: colors.background
  },
  barBackground: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.backgroundBright,
    width: '100%',
    bottom: 0
  },
  barSlider: {
    position: 'absolute',
    height: 3,
    backgroundColor: colors.background,
    width: '50%',
    bottom: 0
  }
})

type Props = {
  tabs: string[]
  swiper: {_component: ScrollView}
  scrollX: Animated.Value
}

export default class SwiperTabs extends Component<Props> {
  shouldComponentUpdate(next: Props) {
    const { tabs } = this.props
    return next.tabs !== tabs
  }

  render() {
    const { tabs, swiper, scrollX } = this.props

    return (
      <View style={styles.container}>
        {tabs.map((label: string, i: number) =>
          <TouchableOpacity
            key={'swiper.'+i}
            style={styles.tab}
            onPress={() => swiper._component.scrollTo({x: i * width})}
            testID={'swiper.'+i}
          >
            <Text style={styles.tabLabel}>
              {label}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.barBackground}/>
        <Animated.View style={[styles.barSlider, {
          transform: [{
            translateX: scrollX.interpolate({
              inputRange: [0, width],
              outputRange: [0, width/2]
            })
          }]
        }]}/>
      </View>
    )
  }
}