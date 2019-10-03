import React, { PureComponent } from 'react'
import { Animated, StyleSheet, View, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import Image from 'react-native-fast-image'

const AnimatedImage = Animated.createAnimatedComponent(Image)

import colors from '../common/colors'

const screen = Dimensions.get('screen')
    , gradientHeight = 7

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
  },
  gradientBottom: {
    position: 'absolute',
    width: screen.width,
    height: gradientHeight,
    bottom: -gradientHeight
  }
})

type Props = {
  image: any
  headerHeight: number
  imageHeight: number
  children?: any
  headerComponent?: any
}

export default class ParalaxScrollView extends PureComponent<Props> {
  state = {
    scrollY: new Animated.Value(0),
  }

  renderBackground() {
    const { scrollY } = this.state
        , { imageHeight, image } = this.props

    return <AnimatedImage
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
      resizeMode={Image.resizeMode.cover}
      source={image}
    />
  }

  renderHeader() {
    const { scrollY } = this.state
        , { imageHeight, headerComponent, headerHeight } = this.props

    return <Animated.View
      style={[styles.header, {
        height: headerHeight,
        transform: [
          {translateY: scrollY.interpolate({
            inputRange: [0, imageHeight, imageHeight + 1],
            outputRange: [imageHeight, 0, 0]
          })}
        ]
      }]}
      pointerEvents='box-none'
  >
    <LinearGradient style={styles.gradientTop} colors={[colors.backgroundTransparent, colors.background]}/>
    {headerComponent}
    <LinearGradient style={styles.gradientBottom} colors={[colors.background, colors.white]}/>
  </Animated.View>

  }

  render() {
    const { children, imageHeight, headerComponent, headerHeight } = this.props
        , { scrollY } = this.state

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

