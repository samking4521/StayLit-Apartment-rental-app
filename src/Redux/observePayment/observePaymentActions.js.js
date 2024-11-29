import { FETCH_OBSERVE_PAYMENT_SUCCESS } from "./observePaymentActionTypes"

export const fetchObservePayment = (observePayment)=>{

    return{
        type: FETCH_OBSERVE_PAYMENT_SUCCESS,
        payload: observePayment
    }
}

