# Redux Middleware for async actions

[![npm version](https://img.shields.io/npm/v/fetch-middleware.svg)](https://www.npmjs.com/package/fetch-middleware) [![npm downloads](https://img.shields.io/npm/dm/fetch-middleware.svg)](https://www.npmjs.com/package/fetch-middleware) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

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
* **payload** must have **data** property and it must to be a function that returns a **Promise**

**Note:** you can pass more properties inside **payload** and it will be passed to success action.

Basic flow: loginSending -> data -> loginSuccess / loginError

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

***Another Note***
You have to pass the default methods to dispatch in case of success or failure, but the middleware will always return a Promise
So if you need to do something after dispatch these methods, you are able to use:

```javascript
dispatch(myAction())
// here we got the dispatch of success or failure and then...
.then()
.catch()
// and so on
```
