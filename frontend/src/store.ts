import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginType{
    type: string;
}

const initialState: LoginType = {type: ""}

const loginTypeSlice = createSlice({
    name: "logintype",
    initialState,
    reducers :{
        setLoginType(state, action: PayloadAction<string>){
            state.type = action.payload
        }
    }
})

let store = configureStore({
    reducer: {
        logintype : loginTypeSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { setLoginType } = loginTypeSlice.actions;

export default store;