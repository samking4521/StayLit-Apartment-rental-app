import { combineReducers } from "redux";
import dbUserReducer from "./dbUser/dbUserReducer";
import dbHostReducer from "./dbHost/dbHostReducer";
import wishListReducer from "./wishList/wishListReducer";
import imageDataReducer from "./imageData/imageReducer";
import userCardFoundReducer from "./userCardFound/userCardFoundReducer";
import paymentHistoryReducer from "./paymentHistory/paymentReducer";
import observePaymentReducer from "./observePayment/observePaymentReducer";
import showProfileReducer from "./showProfile/showProfileReducer";
import hostImageReducer from "./hostImageData/hostImageDataReducer";
import hostBankDetailsReducer from "./hostBankDetails/hostBankDetailsReducer";
import allPaidHostAptsReducer from "./paidHostApartment/paidHostAptReducer";
import observeHostPaymentReducer from "./observeHostPayment/observeHostReducer";
import showHostProfileReducer from "./showHostProfileAlert/showHostProfileReducer";

const rootReducer = combineReducers({
    user: dbUserReducer,
    host: dbHostReducer,
    wish: wishListReducer,
    image: imageDataReducer,
    card: userCardFoundReducer,
    payment: paymentHistoryReducer,
    observePayment: observePaymentReducer,
    profile: showProfileReducer,
    hostImage: hostImageReducer,
    hostBank: hostBankDetailsReducer,
    paidHostApts: allPaidHostAptsReducer,
    observeHostPayment: observeHostPaymentReducer,
    hostProfile: showHostProfileReducer
})

export default rootReducer