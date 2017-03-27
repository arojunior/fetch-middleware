# fetch-middleware

Redux middleware for async actions (side-effects)

* FSA
* Promise based

#### Usage example

Create an action passing all action creators and the apiCall method

```javascript
export const getUserFromGithub = username => {
    return {
        type : [
            githubFetching,
            githubSuccess,
            githubError
        ],
        payload : {
            data : () => axios.get('https://api.github.com/users/' + username)
        }
    }
}
```
* **type** is an Array with actions creators
* **data** belongs to payload and must be a function that returns a Promise

Basic flux: loginSending -> data -> loginSuccess / loginError

The middleware will call loginSending before apiCall and loginSuccess when promise got resolved, if got an error, loginError will be called.

### Reducer / Action creators example to use with the action above
```javascript
import axios from 'axios'
import {createAction} from 'redux-actions'

const GITHUB_FETCHING = 'modules/Github/FETCHING'
const GITHUB_SUCCESS  = 'modules/Github/SUCCESS'
const GITHUB_ERROR    = 'modules/Github/ERROR'

export const githubFetching = createAction(GITHUB_FETCHING)
export const githubError    = createAction(GITHUB_ERROR)
export const githubSuccess  = createAction(GITHUB_SUCCESS)

const initialState = {
    fetching : false,
    user     : null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GITHUB_FETCHING:
            return {...state,
                    fetching     : true
                    }
        case GITHUB_SUCCESS:
            return {...state,
                    fetching     : false,
                    user         : action.payload.data
                  }
        case GITHUB_ERROR:
          return {...state,
                  fetching       : false
                }
      default:
        return state;
    }
}
```
