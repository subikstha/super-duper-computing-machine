import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { apiURL } from '../../constants';

type User = {
    id: number;
    name: string;
    role: string;
}

type Users = {
    items: User[];
    currentUserId: string | null;
    loading: boolean;
    error: string | null;
}

export type CreateUserPayload = {
    name: string;
    role: string;
}

const initialState: Users = {
    items: [],
    currentUserId: '',
    loading: false,
    error: null
}

export const getUsers = createAsyncThunk("users/getUsers", async () => {
    const response = await fetch(`${apiURL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    return response.json();
})

export const postUsers = createAsyncThunk(
    "users/createUsers", // Action type prefix 
    async (user: CreateUserPayload) => {
        const response = await fetch(`${apiURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            throw new Error("Failed to create user")
        }

        return response.json()
    }
)

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
    },
    extraReducers: (builder) => {
        builder.addCase(postUsers.fulfilled, (state, action) => {
            state.items.push(action.payload)
        }).addCase(postUsers.pending, (state, action) => {
            state.loading = false;
            state.error = null;
        }).addCase(postUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "Failed to create user"
        }).addCase(getUsers.fulfilled, (state, action) => {
            if (state.items.length == 0)
                state.items.push(action.payload)
        })
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer