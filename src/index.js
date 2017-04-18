const isArray = type => Array.isArray(type)

const isFunc = val => typeof val === "function"

export default function(store) {
  const {dispatch} = store

  return next => action => {
    const {type, payload} = action

    if (!isArray(type) || !type.every(isFunc) || !isFunc(payload.data)) {
      return next(action)
    }

    const [requesting, success, failure] = type

    dispatch(requesting())

    const request = payload.data()

    return isFunc(request.then)
      ? request.then(
          response => dispatch(success({...payload, data: response.data})),
          error => dispatch(failure({payload: error, error: true}))
        )
      : next(action)
  }
}
