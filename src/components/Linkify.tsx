import * as React from 'react'
import { StyleSheet, Text, Linking } from 'react-native'
import colors from '../common/colors'

const styles = StyleSheet.create({
  link: {
    fontWeight: 'bold',
    color: colors.green
  }
})

export interface Props {
  text: string
  style: any
}

const links = [[
  new RegExp(/(https{0,1}:\/\/){0,1}(www\.){0,1}foodsharing[^\.]*\.(de|network|ch)\S*/i, 'g'),
  'url'
]]

export default class Linkify extends React.PureComponent<Props> {
  enrichText(text: string) {
    let replacer: any = []
      , order: any = []

    links.forEach((link: string[]) => {
      text = text.replace(link[0], (matched: string) => {
        if (matched.match(/\[\[\d+\]\]/))
          return matched

        let id = replacer.length
        replacer[id] = [matched, link[1]]
        return `[[${id}]]`
      })
    })

    order = (text.match(/\[\[(\d+)\]\]/g) || [])
      .map((n: string) => parseInt(n.match(/\d+/g)[0], 10))

    return text
      .split(/\[\[\d+\]\]/)
      .map((e, i) => [
        <Text>{e}</Text>,
        replacer.length > i ?
          <Text
            style={styles.link}
            onPress={() => {
              const link = replacer[order[i]][0]
              Linking.openURL(link.match(/http/) ? link : 'http://'+link)
            }}
            accessibilityLabel={`link to ${replacer[order[i]][0]}`}
          >
            {replacer[order[i]][0]}
          </Text> : null
      ])
  }

  render() {
    const { text, style } = this.props
    return (
      <Text style={style}>
        {this.enrichText(text).map((part, i) =>
          <Text key={`text${i}`}>
            {part[0]}{part[1]}
          </Text>
        )}
      </Text>
    )
  }
}