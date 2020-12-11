import { createAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequest } from "../utils/index";

const setCrits = createAction("SET_CRITS");
const addCrit = createAction("ADD_CRIT");
const updateCrit = createAction("UPDATE_CRIT");
const deleteCrit = createAction("DELETE_CRIT");

const critSlice = createSlice({
    name: "crit",
    initialState: {
        crits: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(setCrits, (state, action) => {
                state.crits = action.payload.crits;
            })
            .addCase(addCrit, (state, action) => {
                state.crits.push(action.payload.crit);
            })
            .addCase(updateCrit, (state, action) => {
                state.crits.find();
            })
            .addCase(deleteCrit, (state, action) => {
                state.crits.filter((crit) => crit._id !== action.payload._id);
            });
    },
});

// builder
//     .addCase(setCrits, (state, action) => {
//         state.crits = action.payload.crits;
//     })
//     .addCase(addCrit, (state, action) => {
//         state.crits.push(action.payload.crit);
//     })
//     .addCase(updateCrit, (state, action) => {
//         state.crits.find();
//     })
//     .addCase(deleteCrit, (state, action) => {
//         state.crits.filter((crit) => crit._id !== action.payload._id);
//     });

export const { reducer: critReducer } = critSlice;
