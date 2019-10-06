import RNFS from 'react-native-fs'
import { getSession } from './agent'
import config from '../common/config'

export default (endpoint: 'uploadBasket', options: any, file: string) => {
  const name = file.split(/\//).pop()
      , {session, token} = getSession()
      , opts = options || {}
      , uri = config.endpoints[endpoint].uri
      , url = config.host +
              Object.keys(opts).reduce((u, key) => u.replace('{' + key +'}', encodeURIComponent(opts[key])), uri)

  RNFS.uploadFiles({
    toUrl: url,
    files: [{
      name,
      filename: name,
      filepath: file,
      filetype: null
    }],
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Cookie': `PHPSESSID=${session}; CSRF_TOKEN=${token}`,
      'X-CSRF-Token': token
    },
    begin: () => console.log('upload', 'begin'),
    progress: () => console.log('upload', 'progress')
  }).promise.then((response) => {
      if (response.statusCode == 200) {
        console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
      } else {
        console.log('SERVER ERROR');
      }
    })
    .catch((err) => {
      if(err.description === "cancelled") {
        // cancelled by user
      }
      console.log(err);
    });
}