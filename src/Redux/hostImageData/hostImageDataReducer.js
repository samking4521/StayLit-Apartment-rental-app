import { STORE_HOST_IMAGE_DATA } from "./hostImageActions"

const initialState = {
    hostImageData : null
}

const hostImageReducer = (state = initialState, action)=>{
    switch(action.type){
        case STORE_HOST_IMAGE_DATA: return {
            hostImageData: action.payload
        }
        default: return state
    }
}

export default hostImageReducer