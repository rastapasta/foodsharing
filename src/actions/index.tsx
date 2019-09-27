import * as types from '../constants'

export const init = (isSimulator: boolean) => ({type: types.INIT, isSimulator})
