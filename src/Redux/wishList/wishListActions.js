import { FETCH_WISHLIST_SUCCESS } from "./wishListActionTypes"

export const fetchWishListSuccess = (wishList)=>{
    return{
        type: FETCH_WISHLIST_SUCCESS,
        payload: wishList
    }
}
