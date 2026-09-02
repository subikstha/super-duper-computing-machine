import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice"
import userReducer from "../features/tasks/userSlice"
import uiReducer from "../features/tasks/uiSlice"

export const store = configureStore({
    reducer: {
        allTasks: taskReducer,
        users: userReducer,
        ui: uiReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* / store.getState() returns the entier Redux state
ReturnType<typeof store.getState> automatically gets its type
therefore type RootState = {
    allTasks: TasksState
} we donot have to manually maintain that type

typeof store.dispatch gets the type of Redux dispatch, we will use that to create a typed hook


*/