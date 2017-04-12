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

        dispatch(requesting())

        return payload.data()
                .then(res => dispatch(success(res)))
                .catch(err => dispatch(failure(err)))
    }
}
