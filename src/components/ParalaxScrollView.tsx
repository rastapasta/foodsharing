import React, { PureComponent } from 'react'
import { Animated, StyleSheet, View, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import FastImage from 'react-native-fast-image'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

import colors from '../common/colors'

const screen = Dimensions.get('screen')
    , gradientHeight = 7

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  background: {
    position: 'absolute',
    width: screen.width,
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    position: 'absolute',
    width: screen.width,
    backgroundColor: colors.white
  },
  gradientTop: {
    position: 'absolute',
    width: screen.width,
    height: gradientHeight,
    top: -gradientHeight
  }
})

type Props = {
  image: any
  imageHeight: number
  children?: any
  headerComponent?: any
}

export default class ParalaxScrollView extends PureComponent<Props> {
  state = {
    scrollY: new Animated.Value(0),
    headerHeight: 0
  }

  renderBackground() {
    const { scrollY } = this.state
        , { imageHeight, image } = this.props
        , Component = false ? Animated.View : AnimatedFastImage

    return <Component
      style={[styles.background, {
        height: imageHeight,
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [-imageHeight, 0, imageHeight],
            outputRange: [imageHeight / 2, 0, -imageHeight / 3]
          })
        }, {
          scale: scrollY.interpolate({
            inputRange: [-imageHeight, 0, imageHeight],
            outputRange: [2, 1, 1]
          })
        }]
      }]}
      resizeMode={FastImage.resizeMode.cover}
      source={image}
    />
  }

  renderHeader() {
    const { headerHeight, scrollY } = this.state
        , { imageHeight, headerComponent } = this.props

    return <Animated.View
      style={[styles.header, headerHeight && {height: headerHeight}, {
        transform: [
          {translateY: scrollY.interpolate({
            inputRange: [0, imageHeight, imageHeight + 1],
            outputRange: [imageHeight, 0, 0]
          })}
        ]
      }]}
      onLayout={({nativeEvent}) =>
        headerHeight ||
        this.setState({headerHeight: nativeEvent.layout.height})
      }
      pointerEvents='none'
  >
    <LinearGradient style={styles.gradientTop} colors={['rgba(255,255,255,0)', colors.background]}/>
    {headerComponent}
  </Animated.View>

  }

  render() {
    const { children, imageHeight, headerComponent } = this.props
        , { headerHeight, scrollY } = this.state

    return <View style={styles.container}>
      {this.renderBackground()}
      <Animated.ScrollView
        style={{flex: 1}}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY }}}],
          {useNativeDriver: true}
        )}
        scrollEventThrottle={15}
      >
        <View style={{
          height: imageHeight + headerHeight - 1,
          backgroundColor: 'transparent'
        }} />
        <View style={styles.content}>
          {children}
        </View>
      </Animated.ScrollView>
      {headerComponent && this.renderHeader()}
    </View>
  }
}

