import { FETCH_OBSERVE_PAYMENT_SUCCESS} from "./observePaymentActionTypes";

const initialState = {
    observePayment : null
}

const observePaymentReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_OBSERVE_PAYMENT_SUCCESS: return{
            observePayment: action.payload
        }
        default: return state
    }
}

export default observePaymentReducer