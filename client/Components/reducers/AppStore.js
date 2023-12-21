import { configureStore } from "@reduxjs/toolkit";
import CartReducer from './CartSlice'
import UserReducer from './UserSlice'

const appStore = configureStore({
    reducer:{
        cart: CartReducer,
        user: UserReducer,
    },
})

export default appStore;