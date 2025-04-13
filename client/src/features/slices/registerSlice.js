import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    form: {
        displayName: "",
        email: "",
        password: "",
        username: "",
    },
    error: {
        displayName: null,
        email: null,
        password: null,
        username: null,
    },
    token: "",
};

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        updateForm(state, { payload }) {
            state.form[payload.name] = payload.value;
        },
        clearForm(state) {
            state.form = initialState.form;
            state.error = initialState.error;
        },
        setError(state, { payload }) {
            state.error[payload.name] = payload.value;
        },
        clearError(state, { payload }) {
            state.error[payload] = null;
        },
        clearErrors(state) {
            state.error = initialState.error;
        },
        updateToken(state, { payload }) {
            state.token = payload.value;
        },
        clearToken(state) {
            state.token = initialState.token;
        }
    },
    extraReducers: (builder) => {
    },
});

export const registerActions = registerSlice.actions;

export default registerSlice.reducer;
