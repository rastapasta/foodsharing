import React, { PureComponent } from 'react'
import { StyleSheet, View, Animated, Dimensions } from 'react-native'
import colors from '../common/colors'

import SwiperTabs from './SwiperTabs'

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
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
  children: any
}

export default class Swiper extends PureComponent<Props> {
  state = {
    scrollX: new Animated.Value(0)
  }
  refs: {
    swiper: any
  }

  render() {
    const { tabs, children } = this.props
        , { scrollX } = this.state
    console.log('[render] swiper')
    return (
      <View style={styles.container}>
        <SwiperTabs scrollX={scrollX} tabs={tabs} swiper={this.refs.swiper} />
        <Animated.ScrollView
          horizontal
          ref="swiper"
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          style={{width}}
          pagingEnabled
          scrollEventThrottle={8}
        >
          {...children}
        </Animated.ScrollView>
      </View>
    )
  }
}