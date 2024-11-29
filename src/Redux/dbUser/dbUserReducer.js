import { FETCH_DBUSER_SUCCESS, FETCH_DBUSER_REQUEST, FETCH_DBUSER_FAILURE } from "./dbUserActionsType"
const initialState = {
    loading: false,
    dbUser: null,
    error: false
}

const dbUserReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_DBUSER_SUCCESS: return{
            loading: false,
            error: false,
            dbUser: action.payload
        }
        case FETCH_DBUSER_REQUEST: return{
            ...state,
            loading: true
        }
        case FETCH_DBUSER_FAILURE: return{
            loading: false,
            error: action.payload,
            dbUser: null
        }
        default: return state
    }
}

export default dbUserReducer