import { FETCH_HOST_PAID_APTS_SUCCESS } from "./paidHostActionType"

const initialState = {
    allHostApt: null
}

const allPaidHostAptsReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_HOST_PAID_APTS_SUCCESS: return{
            allHostApt: action.payload
        }
        default: return state
    }
}

export default allPaidHostAptsReducer