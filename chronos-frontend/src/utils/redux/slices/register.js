import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../API/api";

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const {data} = await api.post('auth/register', params)
    return data
})

const initialState = {
    data: null,
    status: 'loading'
}

const registerSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: {

        [fetchRegister.pending] : (state) => {
            state.status = 'loading'
            state.data = null
        },

        [fetchRegister.fulfilled] : (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },

        [fetchRegister.rejected] : (state) => {
            state.status = 'error'
            state.data = null
        }
    }
})

export const selectIsRegistered = (state) => Boolean(state.register.data)

export const registerReducer = registerSlice.reducer