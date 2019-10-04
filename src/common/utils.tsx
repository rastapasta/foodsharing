export const mergeWithState = (state, id, options) => {
  const newState = {...state}
      , key = `${id}`

  newState[key] = {
    ...state[key],
    ...options
  }

  return newState
}
