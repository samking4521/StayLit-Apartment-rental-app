import { DONTSHOW_HOST_PROFILE, SHOW_HOST_PROFILE } from "./showHostProfileActionsType"

const initialState = {
    showHostProfile: false
}

const showHostProfileReducer = (state = initialState, action)=>{
    switch(action.type){
        case SHOW_HOST_PROFILE: return{
            showHostProfile: true
        }
        case DONTSHOW_HOST_PROFILE: return{
            showHostProfile: false
        }
        default: return state
    }
}

export default showHostProfileReducer