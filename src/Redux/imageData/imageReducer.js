import { STORE_IMAGE_DATA } from "./imageDataActionTypes"

const initialState = {
    ImageData : null
}

const imageDataReducer = (state = initialState, action)=>{
    switch(action.type){
        case STORE_IMAGE_DATA: return{
            imageData: action.payload
        }
        default: return state
    }
}

export default imageDataReducer