import React from 'react'
import {Share} from 'react-native'

import SceneButton from './SceneButton'

type Props = {
  title: string
  url: string
}

export default ({title, url}: Props) =>
  <SceneButton
    onPress={() =>
      Share.share({
        dialogTitle: title,
        message: url
      } as any)
    }
    icon="share-variant"
  />