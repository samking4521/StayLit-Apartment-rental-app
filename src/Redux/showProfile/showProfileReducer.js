import { SHOW_PROFILE_ALERT, DONTSHOW_PROFILE_ALERT } from "./showProfileActionsTypes";

const initialState = {
    showProfile: false
}

const showProfileReducer = (state = initialState, action)=>{
     switch(action.type){
        case SHOW_PROFILE_ALERT: return{
            showProfile: true
        }
        case DONTSHOW_PROFILE_ALERT: return{
            showProfile: false
        }
        default: return state
     }
}

export default showProfileReducer