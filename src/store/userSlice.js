import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:null,
    reducers:{
        userLoggedIn:(state,action)=>{
           return action.payload;
        },
        userLoggedOut:(state)=>{
           return null;
        }
    }

})

export const{userLoggedIn,userLoggedOut}=userSlice.actions
export default userSlice.reducer