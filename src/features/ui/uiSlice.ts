import { createSlice } from "@reduxjs/toolkit";

type Ui = {
    taskModalOpen: boolean
}

const initialState: Ui = {
    taskModalOpen: false
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleModalState: (state) => {
            state.taskModalOpen = !state.taskModalOpen
        }
    }
})

export const { toggleModalState } = uiSlice.actions;

export default uiSlice.reducer