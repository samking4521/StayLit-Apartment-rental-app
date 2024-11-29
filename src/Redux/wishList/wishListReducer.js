import { FETCH_WISHLIST_SUCCESS } from "./wishListActionTypes"

const initialState = {
    wishList : null
}

const wishListReducer = (state = initialState, action)=>{
    switch(action.type){
        case FETCH_WISHLIST_SUCCESS: return{
            wishList: action.payload
        }

        default: return state
    }
}

export default wishListReducer