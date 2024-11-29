import { STORE_IMAGE_DATA } from "./imageDataActionTypes"

export const storeImageData = (image)=>{
    return{
        type: STORE_IMAGE_DATA,
        payload: image
    }
}