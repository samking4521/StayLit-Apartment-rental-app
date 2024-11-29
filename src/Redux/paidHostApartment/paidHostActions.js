import { FETCH_HOST_PAID_APTS_SUCCESS } from "./paidHostActionType";

export const fetchAllPaidApts = (paidApartments)=>{
    return{
        type: FETCH_HOST_PAID_APTS_SUCCESS,
        payload: paidApartments
    }
}