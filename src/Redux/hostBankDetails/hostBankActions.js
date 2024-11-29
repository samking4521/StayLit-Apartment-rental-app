import { STORE_HOST_BANK } from "./hostBankActionTypes";

export const storeHostBank = (bankDetails)=>{
    return{
        type: STORE_HOST_BANK,
        payload: bankDetails
    }
}