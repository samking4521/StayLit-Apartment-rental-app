import { FETCH_DBHOST_FAILURE, FETCH_DBHOST_REQUEST, FETCH_DBHOST_SUCCESS } from "./dbHostActionsType"

const initialState = {
    dbHost: null,
    error: false
}

const dbHostReducer = (state = initialState, action)=>{
        switch(action.type){
            case FETCH_DBHOST_REQUEST: return{
                dbHost: null,
                error: false
            }
            case FETCH_DBHOST_SUCCESS: return{
                dbHost: action.payload,
                error: false
            }
            case FETCH_DBHOST_FAILURE: return{
               dbHost: null,
               error: action.payload
            }

            default: return state
        }
}

export default dbHostReducer