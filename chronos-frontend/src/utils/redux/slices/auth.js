import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const {data} = await api.post('auth/login', params)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const {data} = await api.post('/me')
    return data
})

export const fetchLogout = createAsyncThunk('auth/fetchLogout', async () => {
    const {data} = await api.post('auth/logout')
    return data
})

const initialState = {
    data: null,
    status: 'loading'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: {
        [fetchAuth.pending] : (state) => {
            state.status = 'loading'
            state.data = null
        },

        [fetchAuth.fulfilled] : (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },

        [fetchAuth.rejected] : (state) => {
            state.status = 'error'
            state.data = null
        },

        [fetchAuthMe.pending] : (state) => {
            state.status = 'loading'
            state.data = null
        },

        [fetchAuthMe.fulfilled] : (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },

        [fetchAuthMe.rejected] : (state) => {
            state.status = 'error'
            state.data = null
        },

        [fetchLogout.pending] : (state) => {
            state.status = 'loading'
        },

        [fetchLogout.fulfilled] : (state) => {
            state.status = 'loaded'
            state.data = null
        },

        [fetchLogout.rejected] : (state) => {
            state.status = 'error'
        }
    }
})

export const selectIsAuth = (state) => Boolean(state.auth.data)
export const selectAuthUser = (state) => state.auth.data

export const authReducer = authSlice.reducer