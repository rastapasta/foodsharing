import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, ScrollView, FlatList, SafeAreaView } from 'react-native'
import ActivityIndicator from '../components/ActivityIndicator'
import { withNavigationFocus } from 'react-navigation'
import Image from 'react-native-fast-image'
import Hyperlink from 'react-native-hyperlink'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import WallPost from '../components/WallPost'
import Swiper from '../components/Swiper'

import { Fairteiler as FairteilerType } from '../common/typings'
import colors from '../common/colors'
import config from '../common/config'
import { translate } from '../common/translation'

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
  }
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
        , wall = walls.fairteiler[`${id}`] || {}
        , data = fairteiler[id] || null

    if (!data)
      return <ActivityIndicator backgroundColor={colors.white} color={colors.background} />

    return (
      <SafeAreaView style={styles.container} testID="fairteiler.scene">
        <View style={styles.box}>
          <Text style={styles.headline} testID="fairteiler.name">{data.name}</Text>
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

        <Swiper tabs={[
          translate('fairteiler.information'),
          translate('fairteiler.messages') + (wall.results && wall.results.length ? ` (${wall.results.length})` : '')
        ]}>
          <ScrollView style={{width}} testID="fairteiler.information">
            <View style={styles.box}>
              <Hyperlink linkDefault linkStyle={{color: colors.green}}>
                <Text style={styles.text}>
                  {data.description}
                </Text>
              </Hyperlink>
            </View>
          </ScrollView>

          <FlatList
            testID="fairteiler.wall"
            data={wall.results || []}
            style={{width}}
            ListHeaderComponent={() => !!wall.results && !!wall.results.length && <View style={{height: 5}} />}
            keyExtractor={(item: any)=> item.id.toString()}
            renderItem={WallPost}
            ListEmptyComponent={() =>
              <View style={styles.box}>
                <Text style={styles.text}>
                  {translate('wall.no_posts')}
                </Text>
              </View>
            }
          />
        </Swiper>
      </SafeAreaView>
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
