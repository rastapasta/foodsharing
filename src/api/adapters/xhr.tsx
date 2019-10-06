import agent from '../agent'
import { Marker } from '../../common/typings'

export const getMarker = async (): Promise<{fairteiler: Marker[], baskets: Marker[]}> =>
  agent('marker')
