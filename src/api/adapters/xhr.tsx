import agent from '../agent'
import { Marker } from '../../common/typings'

export const getFairteilerMarker = async (): Promise<Marker[]> =>
  (await agent('fairteilerMarker')).fairteiler
