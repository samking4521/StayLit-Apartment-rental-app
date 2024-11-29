import { FETCH_DBHOST_SUCCESS, FETCH_DBHOST_REQUEST, FETCH_DBHOST_FAILURE} from "./dbHostActionsType";

export const fetchDbHostRequest = ()=>{
    return{
        type: FETCH_DBHOST_REQUEST
    }
}

export const fetchDbHostSuccess = (dbHost)=>{
    return{
        type: FETCH_DBHOST_SUCCESS,
        payload: dbHost
    }
}

export const fetchDbHostFailure = (error)=>{
    return{
        type: FETCH_DBHOST_FAILURE,
        payload: error
    }
}