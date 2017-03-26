# fetch-middleware

Redux middleware for async actions (side-effects)

* FSA
* Promise based

#### Usage example

Create an action passing all action creators and the apiCall method

```javascript
export const sendFormLogin = values => {
    return {
        type : [
            loginSending,
            loginSuccess,
            loginError
        ],
        payload : {
            apiCall : () => axios.post('/api/login', values)
        }
    }
}
```
* **type** is an Array with action creators
* **apiCall** must be a function that return a Promise

The middleware will call loginSending before apiCall and loginSuccess when promise got resolved, if got an error, loginError will be called.

loginSending -> apiCall -> loginSuccess / loginError

### Reducer / Action creators example to use with the action above
```javascript
import axios from 'axios'
import {createAction} from 'redux-actions'

const LOGIN_SENDING = 'modules/Login/SENDING'
const LOGIN_SUCCESS = 'modules/Login/SUCCESS'
const LOGIN_ERROR =  'modules/Login/ERROR'

const loginSending = createAction(LOGIN_SENDING)
const loginError   = createAction(LOGIN_ERROR)
const loginSuccess = createAction(LOGIN_SUCCESS, payload => {
    console.log(payload.data)
})

const initialState = {
    text        : null,
    sending     : false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SENDING:
            return {...state,
                    text        : "Wait for it...",
                    sending     : true
                    }
        case LOGIN_SUCCESS:
            return {...state,
                    text        : null,
                    sending     : false
                  }
        case LOGIN_ERROR:
          return {...state,
                  text        : action.payload.data,
                  sending     : false
                }
      default:
        return state;
    }
}
```
