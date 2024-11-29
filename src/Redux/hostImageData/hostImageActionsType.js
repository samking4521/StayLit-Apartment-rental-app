import { STORE_HOST_IMAGE_DATA } from "./hostImageActions";

export const storeHostImageData = (image)=>{
    return{
        type: STORE_HOST_IMAGE_DATA,
        payload: image
    }
}