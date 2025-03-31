import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import conversionReducer from "./conversionSlice"
export const appStore=configureStore({
   reducer:{
    user:userReducer,
    conversions:conversionReducer
   } 
})