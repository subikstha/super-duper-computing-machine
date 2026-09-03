import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice"
import userReducer from "../features/user/userSlice"
import uiReducer from "../features/ui/uiSlice"

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
typeof store.getState means "What is the type of getState function?"
ReturnType<Typeof store.getState> means "What does getState() return?"
Therefore RootState becomes
RootState = {
allTasks: ...
users: ...
ui: ...
}

const user = useSelector(
    (state: RootState) => state.user
);
RootState is useful because it helps TS understand state.users, state.ui, state.allTasks etc
and also helps in catching mistakes like state.somethingThatDoesNotExist will generate an error

typeof store.dispatch gets the type of Redux dispatch, we will use that to create a typed hook




*/

///////////////////////////////////////////////////////////////////////////////
/*
export type AppDispatch = typeof store.dispatch;
this will get the type of the store's dispatch function with the help of which you can create typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>() and
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

And then the components can simply do
const dispatch = useAppDispatch();

const user = useAppSelector(
    state => state.user
);

                         Redux Store
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
      user                userCrops             locations
       │                     │                     │
  userSlice.reducer   userCropsSlice.reducer  countriesLocationSlice
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                       configureStore()
                             │
                             ▼
                          <Provider>
                             │
                    ┌────────┴────────┐
                    │                 │
               React Component   React Component
                    │                 │
              useSelector        useDispatch
                    │                 │
                    ▼                 ▼
               Read state        Send action
                                      │
                                      ▼
                                   Reducer
                                      │
                                      ▼
                                  New state
*/