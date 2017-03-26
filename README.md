# fetch-middleware

Redux middleware for async actions


# usage example

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
