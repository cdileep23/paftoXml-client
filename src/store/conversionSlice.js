import { createSlice } from "@reduxjs/toolkit";

const conversionSlice=createSlice({
    name:"conversions",
    initialState:null,
    reducers:{
        setAllConversions:(state,action)=>{
            return action.payload
        },
        resetConversions:(state)=>{
            return null;
        }
       
    }

})

export const{setAllConversions,resetConversions}=conversionSlice.actions
export default conversionSlice.reducer