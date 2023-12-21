import { createSlice } from "@reduxjs/toolkit";


const findItemIndex = (items, newItem,size) => {
    return items.findIndex(item => (item.pageData.id === newItem.id && item.size===size));
};

const findItemIndex2 = (items, newItem) => {
    return items.findIndex(item => item.pageData.id === newItem.pageData.id);
};

const loadItems = () => {
    const storedItems = localStorage.getItem('cart');
    return storedItems===null ? [] : JSON.parse(storedItems);
  };
  

const CartSlice = createSlice({
    name:'cart',
    initialState:{
        items:loadItems(),
    },
    reducers:{
        addItem:(state,action)=>{
            
            const {pageData,count,size} = action.payload;
            const existingItemIndex = findItemIndex(state.items, pageData,size);

            if (existingItemIndex !== -1) {
                state.items[existingItemIndex].count += count;
            } else {
                state.items.push(action.payload);
            }
                    
        },
        removeItem: (state,action) => {
            const delItem = action.payload;
            const existingItemIndex = findItemIndex2(state.items, delItem);
            if (existingItemIndex !== -1) {
                state.items.splice(existingItemIndex, 1);
            }
        },
        clearItem: (state,action) => {
            state.items.length=0;
        },
        updateItem:(state,action) => {
            const item = action.payload;
            const existingItemIndex = findItemIndex2(state.items,item);
            state.items[existingItemIndex].count=item.count;
        }
    },
})

export const {addItem, removeItem, clearItem,updateItem} = CartSlice.actions;

export default CartSlice.reducer