import { FETCH_USER_CARD_SUCCESS } from "./userCardFoundActionsType"

const initialState = {
    userCardFound: null
}

const userCardFoundReducer = (state = initialState, action)=>{
     switch(action.type){
        case FETCH_USER_CARD_SUCCESS: return{
            userCardFound: action.payload
        }
        default: return state
     }
}

export default userCardFoundReducer