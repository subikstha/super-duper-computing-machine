import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Task = {
    id: number;
    title: string;
    completed: boolean;
    assigneeId: number;
}

type TasksState = {
    tasks: Task[]
}

const initialState: TasksState = {
    tasks: []
}

// Taskslice creates a redux slice to tell redux we want a section of my global state responsible for tasks.
// Taskslice consists of the initial state, reducers, and actions. The reducers are functions that will be responsible for updating the state of the tasks slice. The actions are functions that will be responsible for dispatching actions to the reducers.
const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ title: string, assigneeId: number }>) => {
            if (state.tasks.length == 0) {
                state.tasks.push({
                    id: 1,
                    title: action.payload.title,
                    assigneeId: action.payload.assigneeId,
                    completed: false
                })
            } else {
                const taskId = state.tasks.splice(-1, Infinity)[0].id + 1;
                state.tasks.push({
                    id: taskId,
                    title: action.payload.title,
                    assigneeId: action.payload.assigneeId,
                    completed: false
                })
            }
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        toggleTask: (state, action: PayloadAction<string>) => {
            const taskToToggle = state.tasks.find(task => task.title == action.payload)

            if (taskToToggle) {
                taskToToggle.completed = !taskToToggle.completed;
            }
        }
    }
})

export const { addTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;