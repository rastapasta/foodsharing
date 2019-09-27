// import { ActionConst } from 'react-native-router-flux'

const initialState = {
  scene: {}
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    // case ActionConst.FOCUS:
    //   return {
    //     ...state,
    //     scene: action.scene
    //   }

    // ...other actions

    default:
      // console.log(state, action)
      return state
  }
}