import RNFetchBlob from 'rn-fetch-blob'
import { getSession } from './agent'
import config from '../common/config'

export default (endpoint: 'uploadBasket', options: any, file: string) => {
  const {session, token} = getSession()
      , opts = options || {}
      , uri = config.endpoints[endpoint].uri
      , url = config.host +
              Object.keys(opts).reduce((u, key) => u.replace('{' + key +'}', encodeURIComponent(opts[key])), uri)
      , header = {
        'Accept': 'application/json',
        'Cookie': `PHPSESSID=${session}; CSRF_TOKEN=${token}`,
        'X-CSRF-Token': token
        // 'Content-Type': 'application/octet-stream'
      }

  return RNFetchBlob.fetch('PUT', url, header, RNFetchBlob.wrap(file))
}