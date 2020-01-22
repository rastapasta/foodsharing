import Upload from 'react-native-background-upload'

import { getSession } from './agent'
import { store } from '../common/store'
import config from '../common/config'
import { REQUEST_ERROR, BASKET_UPLOAD_PROGRESS } from '../common/constants'

export const convertLocalIdentifierToAssetLibrary = (localIdentifier, ext) => {
  const hash =  localIdentifier.split('/')[0];
  return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
}

export default (endpoint: 'uploadBasket', options: any, file: string) => new Promise(async resolve => {
  const {session, token} = getSession()
      , opts = options || {}
      , uri = config.endpoints[endpoint].uri
      , url = config.host +
              Object.keys(opts).reduce((u, key) => u.replace('{' + key +'}', encodeURIComponent(opts[key])), uri)
      , path =
        file.startsWith('/') ? 'file://' + file :
        file.startsWith('ph://') ? convertLocalIdentifierToAssetLibrary(file.substr(5), 'JPG') :
        file
      , headers = {
        'Accept': 'application/json',
        'User-Agent': config.userAgent,
        'Cookie': `PHPSESSID=${session}; CSRF_TOKEN=${token}`,
        'X-CSRF-Token': token,
        'Content-Type': 'application/octet-stream',
      }

  const uploadId = await Upload.startUpload({
        url,
        method: 'PUT',
        type: 'raw',
        path,
        headers,
        notification: {
          enabled: true
        }
      })

  Upload.addListener('progress', uploadId, data => store.dispatch({type: BASKET_UPLOAD_PROGRESS, payload: data.progress}))
  Upload.addListener('error', uploadId, () =>  store.dispatch({type: REQUEST_ERROR}))
  Upload.addListener('cancelled', uploadId, () =>  store.dispatch({type: REQUEST_ERROR}))
  Upload.addListener('completed', uploadId, () => resolve())
})