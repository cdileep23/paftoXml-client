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
        },
        addConversion: (state, action) => {
            state.conversions.unshift(action.payload); // Add new conversion at the beginning
          },
       
    }

})

export const{setAllConversions,resetConversions,addConversion}=conversionSlice.actions
export default conversionSlice.reducer