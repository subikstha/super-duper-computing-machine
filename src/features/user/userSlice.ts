import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type User = {
    id: number;
    name: string;
    role: string;
}

type Users = {
    items: User[];
    currentUserId: string;
}

const initialState: Users = {
    items: [],
    currentUserId: ''
}

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<{ name: string, role: string }>) => {
            const userId = state.items.splice(-1, Infinity)[0].id + 1;
            state.items.push({
                id: userId,
                name: action.payload.name,
                role: action.payload.role
            })
        },
        setCurrentUser: (state, action: PayloadAction<string>) => {
            state.currentUserId = action.payload
        }
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer