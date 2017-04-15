const isArray = type => Array.isArray(type)

const isFunc = val => typeof val === 'function'

export default function(store) {

    const {dispatch} = store

    return next => action => {

        const {type, payload} = action

        if ( ! isArray(type) || ! type.every(isFunc)) {
            return next(action)
        }

        const [
            requesting,
            success,
            failure
        ] = type

        const { data:request } = payload;

        return Promise.resolve(requesting) // pass the result of requesting action to promise chain
                      .then(dispatch)
                      .then(request) // do the user request call
                      .then(success) // pass the success action
                      .then(dispatch)
                      .catch(failure) // in case of failure of any item in the chain, pass through failure action
                      .then(dispatch)
    }
}
