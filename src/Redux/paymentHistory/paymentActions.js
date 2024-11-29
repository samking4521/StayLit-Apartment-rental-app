import { FETCH_PAID_APARTMENT } from "./paymentActionsType"

export const fetchPaidApartments = (payments)=>{
    return{
        type: FETCH_PAID_APARTMENT,
        payload: payments
    }
}