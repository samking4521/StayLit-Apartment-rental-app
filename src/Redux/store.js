import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import { thunk } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './rootReducer'

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(logger, thunk)))

export default store