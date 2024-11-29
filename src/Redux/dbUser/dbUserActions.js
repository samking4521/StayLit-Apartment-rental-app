import { FETCH_DBUSER_REQUEST, FETCH_DBUSER_SUCCESS, FETCH_DBUSER_FAILURE } from "./dbUserActionsType"

export const fetchDbUserRequest = ()=>{
    return{
        type: FETCH_DBUSER_REQUEST
    }
}

export const fetchDbUserSuccess = (dbUser)=>{
    return{
        type: FETCH_DBUSER_SUCCESS,
        payload: dbUser
    }
}

export const fetchDbUserFailure = (error)=>{
    return{
        type: FETCH_DBUSER_FAILURE,
        payload: error
    }
}



