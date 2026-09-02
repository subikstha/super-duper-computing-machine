import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
    status: 'all' | 'pending' | 'completed';
    search: string;
}

const initialState: FilterState = {
    status: 'all',
    search: ''
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilterStatus: (state, action: PayloadAction<'all' | 'pending' | 'completed'>) => {
            state.status = action.payload
        },
        setFilterSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        }
    }
})

export const { setFilterStatus, setFilterSearch } = filterSlice.actions

export default filterSlice.reducer