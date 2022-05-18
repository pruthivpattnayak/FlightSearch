import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchResult } from "./searchAPI";

const initialState = {
    isLoading: false,
    searchData: {},
    results: [],
    filter: {
        selected: [],
        filtered: [],
    },
    pagination: {
        page: 0,
    },
    error: null,
};

export const fetchResultsAsync = createAsyncThunk(
    "search/fetchResults",
    async (param) => {
        const response = await fetchResult(param);
        // The value we return becomes the `fulfilled` action payload
        return response;
    }
);

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        updateFilter: (state, action) => {
            console.log(action.payload);
            const { value, checked } = action.payload;
            if (checked) {
                state.filter.selected.push(value);
            } else {
                state.filter.selected = state.filter.selected.filter(
                    (item) => item !== value
                );
            }

            // if selected is empty, set it to all
            if (state.filter.selected.length === 0) {
                state.filter.filtered = state.results;
            } else {
                state.filter.filtered = state.results.filter((item) =>
                    state.filter.selected.includes(item.company)
                );
            }
        },
        updatePagination: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchResultsAsync.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchResultsAsync.fulfilled, (state, action) => {
            state.isLoading = false;
            const { results, pagination, uniqueAirlines } = action.payload;
            state.results = results;
            state.pagination = pagination;
            state.filter.filtered = results;

            state.filter.uniqueAirlines = uniqueAirlines;
        });
        builder.addCase(fetchResultsAsync.rejected, (state) => {
            state.isLoading = false;
            state.error = "Something went wrong";
        });
    },
});

export const { updateFilter, updatePagination } = searchSlice.actions;

export const selectCount = (state) => state.search.value;

export default searchSlice.reducer;
