import { STORE_HOST_BANK } from "./hostBankActionTypes"

const initialState = {
    hostBankDetails: null
}

const hostBankDetailsReducer = (state = initialState, action)=>{
    switch(action.type){
        case STORE_HOST_BANK: return{
            hostBankDetails: action.payload
        }
        default: return state
    }
}

export default hostBankDetailsReducer