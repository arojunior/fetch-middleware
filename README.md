# Redux Middleware for async actions

* FSA
* Promise based

#### Usage example

* **Actions creators**

```javascript
const githubFetching = createAction(GITHUB_FETCHING)
const githubError    = createAction(GITHUB_ERROR)
const githubSuccess  = createAction(GITHUB_SUCCESS)
```

* Create an action passing all action creators and the api call method

```javascript
export const getUserFromGithub = username => ({
  type : [
    githubFetching,
    githubSuccess,
    githubError
  ],
  payload : {
    data : () => axios.get(`https://api.github.com/users/${username}`)
  }
})
```
* **type** is an Array with actions creators
* **data** belongs to **payload** and must be a function that returns a **Promise**

Basic flux: loginSending -> data -> loginSuccess / loginError

The middleware will call loginSending before apiCall and loginSuccess when promise got resolved, if got an error, loginError will be called.

### Reducer / Action creators example (with redux-actions)

* **Actions types**

```javascript
export const GITHUB_FETCHING = 'modules/Github/FETCHING'
export const GITHUB_SUCCESS  = 'modules/Github/SUCCESS'
export const GITHUB_ERROR    = 'modules/Github/ERROR'
```

* **Reducer**

```javascript
import {handleActions} from 'redux-actions'

import {GITHUB_FETCHING, GITHUB_SUCCESS, GITHUB_ERROR} from './actions'

const initialState = {
  fetching : false,
  user     : null
}

const reducer = handleActions({
  [GITHUB_FETCHING]: (state, action) => ({
    ...state,
    sending     : true
  }),

  [GITHUB_SUCCESS]: (state, action) => ({
    sending     : false,
    user        : action.payload.data
  }),

  [GITHUB_ERROR]: (state, action) => ({
    ...state,
    sending     : false,
  })

}, initialState);

export default reducer
```

### Example without redux-actions

```javascript
const githubFetching = () => ({ type : 'GITHUB_FETCHING' })
const githubError    = () => ({ type : 'GITHUB_ERROR' })
const githubSuccess  = payload => ({
  type    : 'GITHUB_SUCCESS',
  payload : payload
})

const initialState = {
  fetching : false,
  user     : null
}

export const getUserFromGithub = username => ({
  type : [
    githubFetching,
    githubSuccess,
    githubError
  ],
  payload : {
      data : () => axios.get(`https://api.github.com/users/${username}`)
  }
})

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GITHUB_FETCHING':
      return {...state,
              fetching     : true
              }
    case 'GITHUB_SUCCESS':
      return {...state,
              fetching     : false,
              user         : action.payload.data
              }
    case 'GITHUB_ERROR':
      return {...state,
              fetching       : false
            }
    default:
      return state
  }
}
```
