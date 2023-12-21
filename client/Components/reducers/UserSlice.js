import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name:'userInfo',
    initialState:{
        item:{
            username:"",
            email:"",
        }
    },
    reducers:{
        addItem: (state,action)=>{
            console.log(action.payload);
            state.item.username=action.payload.username;
            state.item.email = action.payload.email;
        },
        removeItem : (state)=>{
            state.item.username="";
            state.item.email="";
        }
    }
})


export const {addItem,removeItem} = UserSlice.actions;

export default UserSlice.reducer;