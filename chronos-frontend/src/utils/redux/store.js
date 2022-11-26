import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { registerReducer } from "./slices/register";

const store = configureStore({
    reducer: {
        auth: authReducer,
        register: registerReducer
    }
})

export default store