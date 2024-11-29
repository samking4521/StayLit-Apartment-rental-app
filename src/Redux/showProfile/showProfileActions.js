import { SHOW_PROFILE_ALERT, DONTSHOW_PROFILE_ALERT } from "./showProfileActionsTypes"

export const showProfileAlert = ()=>{
    return{
        type: SHOW_PROFILE_ALERT
    }
}

export const dontShowProfileAlert = ()=>{
    return{
        type: DONTSHOW_PROFILE_ALERT
    }
}