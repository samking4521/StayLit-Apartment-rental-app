import { FETCH_OBSERVE_HOST_PAYMENT_SUCCESS } from "./observeHostActionsType";

export const fetchObserveHostPayment = (observeHost)=>{
    return{
        type: FETCH_OBSERVE_HOST_PAYMENT_SUCCESS,
        payload: observeHost
    }
}