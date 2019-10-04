import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Animated, ScrollView, FlatList } from 'react-native'
import Swiper from 'react-native-swiper'
import ActivityIndicator from '../components/ActivityIndicator'
import { withNavigationFocus } from 'react-navigation'
import Image from 'react-native-fast-image'
import Hyperlink from 'react-native-hyperlink'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import WallPost from '../components/WallPost'

import { Fairteiler as FairteilerType } from '../common/typings'
import colors from '../common/colors'
import config from '../common/config'

const placeholderImage = 'https://foodsharing.de/img/fairteiler_head.jpg'
    , { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  box: {
    padding: 10
  },
  headline: {
    fontFamily: 'Alfa Slab One',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000'
  },
  text: {
    fontSize: 12,
  },
  seperator: {
    backgroundColor: colors.gray,
    height: 1,
    marginLeft: 10,
    marginRight: 10
  },
  image: {
    height: height * 0.2
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
    fontSize: 14,
    color: colors.background
  },

})

type Props = {
  id: number
  fairteiler: {string: FairteilerType}
  actions: any
  walls: any
  isFocused: boolean
}

class Fairteiler extends PureComponent<Props> {
  refs: {
    swiper: any
  }
  state = {
    scrollX: new Animated.Value(0)
  }

  componentDidUpdate(prevProps: Props) {
    const { actions, id } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('fairteiler', id)
  }

  componentDidMount() {
    const { actions, id } = this.props
    actions.navigation('fairteiler', id)
    actions.fetchFairteiler(id)

    actions.fetchWall('fairteiler', id)
  }

  render() {
    const { id, fairteiler, walls } = this.props
        , { scrollX } = this.state
        , wall = walls.fairteiler[`${id}`] || []
        , data = fairteiler[id] || null

    if (!data)
      return <ActivityIndicator backgroundColor={colors.white} color={colors.background} />

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.headline}>{data.name}</Text>
          <Text style={styles.text}>
            {data.address}{'\n'}
            {data.postcode} {data.city}
          </Text>
        </View>

        <View style={styles.seperator} />

        <Image
          source={{uri: data.picture ? config.host + '/images/' + data.picture : placeholderImage}}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => this.refs.swiper.scrollBy(-1)}
          >
            <Text style={styles.tabLabel}>
              Informationen
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => this.refs.swiper.scrollBy(1)}
          >
            <Text style={styles.tabLabel}>
              Nachrichten{wall && wall.results ? ` (${wall.results.length})` : ''}
            </Text>
          </TouchableOpacity>

          <View style={{
            position: 'absolute',
            height: 3,
            backgroundColor: colors.backgroundBright,
            width: width,
            bottom: 0
          }}/>
          <Animated.View style={{
            position: 'absolute',
            height: 3,
            backgroundColor: colors.background,
            width: width/2,
            bottom: 0,
            transform: [{
              translateX: scrollX.interpolate({
                inputRange: [0, width],
                outputRange: [0, width/2]
              })
            }]
          }}/>
        </View>
        <Swiper
          animated
          ref="swiper"
          loop={false}
          showsPagination={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          scrollEventThrottle={8}
        >
          <ScrollView style={{flex: 1}}>
            <View style={styles.box}>
              <Hyperlink linkDefault linkStyle={{color: colors.green}}>
                <Text style={styles.text}>
                  {data.description}
                </Text>
              </Hyperlink>
            </View>
          </ScrollView>
          <FlatList
            data={wall && wall.results || []}
            style={{flex: 1}}
            keyExtractor={(item: any)=> item.id.toString()}
            renderItem={WallPost}
              // <Text>{JSON.stringify(item)}</Text>
          />
        </Swiper>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  fairteiler: state.fairteiler,
  walls: state.walls
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Fairteiler))
