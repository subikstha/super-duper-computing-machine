import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiURL } from '../../constants';

type Task = {
    id: string;
    title: string;
    completed: boolean;
    assigneeId: string;
}

type TasksState = {
    tasks: Task[]
    loading: boolean;
    error: string | null;
}

export type CreateTaskPayload = {
    title: string;
    assigneeId: string;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null
}

// Taskslice creates a redux slice to tell redux we want a section of my global state responsible for tasks.
// Taskslice consists of the initial state, reducers, and actions. The reducers are functions that will be responsible for updating the state of the tasks slice. The actions are functions that will be responsible for dispatching actions to the reducers.
export const postTasks = createAsyncThunk("tasks/createTask", async (task: CreateTaskPayload) => {
    const response = await fetch(`${apiURL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })

    if (!response.ok) {
        throw new Error("Failed to create a task")
    }

    return response.json()
})

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ title: string, assigneeId: string }>) => {
            state.tasks.push({
                id: (new Date()).toISOString(),
                title: action.payload.title,
                assigneeId: action.payload.assigneeId,
                completed: false
            })
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        toggleTask: (state, action: PayloadAction<string>) => {
            const taskToToggle = state.tasks.find(task => task.title == action.payload)

            if (taskToToggle) {
                taskToToggle.completed = !taskToToggle.completed;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(postTasks.fulfilled, (state, action) => {
            state.tasks.push(action.payload)
        })
    }
})

export const { addTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;