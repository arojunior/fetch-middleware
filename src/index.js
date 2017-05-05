const isArray = type => Array.isArray(type)

const isFunc = val => typeof val === 'function'

/**
 * Factory to create action dispatchers
 * @param {Function} dispatch - the store dispatcher
 * @param {Function} fn - the redux action to be dispatched
 * @returns {Function} a function that dispatch data through the redux action
 */
const createDispatcher = (dispatch, fn) => data => { dispatch(fn(data)) } 

export default function(store) {
  const {dispatch} = store

  return next => action => {
    const {type, payload} = action

    if (!isArray(type) || !type.every(isFunc) || !isFunc(payload.data)) {
      return next(action)
    }

    const [
        requestingAction,
        successAction,
        failureAction
    ] = type

    const requestingDispatcher = createDispatcher(dispatch, requestingAction); 
    const failureDispatcher = createDispatcher(dispatch, failureAction);
    const successDispatcher = createDispatcher(dispatch, successAction);

    const { data:request } = payload;

    return
        isFunc(request.then)
          ?
            Promise.resolve()
              .then(requestingDispatcher) // pass the result of requesting action to promise chain
              .then(request) // do the user request call
              .then(successDispatcher) // pass the success action
              .catch(failureDispatcher) // in case of failure of any item in the chain, pass through failure action
          :
            next(action)
  }
}
