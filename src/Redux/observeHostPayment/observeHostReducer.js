import { FETCH_OBSERVE_HOST_PAYMENT_SUCCESS } from "./observeHostActionsType"

const initialState = {
    observeHostPay: null
}

const observeHostPaymentReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_OBSERVE_HOST_PAYMENT_SUCCESS: return{
            observeHostPay: action.payload
        }
        default: return state
    }
}

export default observeHostPaymentReducer