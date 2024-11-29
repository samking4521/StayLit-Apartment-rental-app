import { FETCH_USER_CARD_SUCCESS } from "./userCardFoundActionsType";

export const fetchUserCardSuccess = (userCard)=>{
    return{
        type: FETCH_USER_CARD_SUCCESS,
        payload: userCard
    }
}