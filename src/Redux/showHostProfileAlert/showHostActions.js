import { SHOW_HOST_PROFILE, DONTSHOW_HOST_PROFILE } from "./showHostProfileActionsType";

export const showHostProfile = ()=>{
    return{
        type: SHOW_HOST_PROFILE
    }
}

export const dontShowHostProfile = ()=>{
    return{
        type: DONTSHOW_HOST_PROFILE
    }
}