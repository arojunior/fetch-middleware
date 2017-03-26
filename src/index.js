const isArray = type => Array.isArray(type)

export default function(store) {

    const {dispatch} = store

    return next => action => {

        const {type, payload} = action

        if ( ! isArray(type)) {
            return next(action)
        }

        const [
            requesting,
            success,
            failure
        ] = type

        dispatch(requesting())

        return payload.apiCall()
                .then(res => dispatch(success(res)))
                .catch(err => dispatch(failure(err)))
    }
}
