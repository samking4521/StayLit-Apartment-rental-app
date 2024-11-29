import { FETCH_PAID_APARTMENT } from "./paymentActionsType"

const initialState = {
     paidApartments : null
}

const paymentHistoryReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_PAID_APARTMENT: return{
            paidApartments: action.payload
        }
        default: return state
    }
}

export default paymentHistoryReducer