import {
  useDispatch,
  useSelector,
} from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () =>
  useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;

///////////////////////////////////////////////////////////////////
/*
The main reason for this file is TypeScript type safety around Redux hooks.

Without this file, every component would have to manually tell TypeScript what your Redux store looks like.
useSelector() and useDispatch() are react redux hooks
useSelector reads data from the Redux store
useDispatch sends action to the Redux store
The problem is that plain Redux hooks donot automatically know the types of the particular store
export type RootState = ReturnType<typeof store.getState>; this gives the type of the root state
export type AppDispatch = typeof store.dispatch; and this tells TS the kind of actions your particular store can dispatch

The problem with plain useSelector is with just
const tasks = useSelector(state => state.tasks.items), TS does not know the type of state
Without typing the hook, TS does not necessarily know that state.tasks exists

Manually doing
const tasks = useSelector((state: RootState) => state.tasks.items) will help TS understand the types
but if there are many components we have to write this everywhere and can be repititive

TypedUseSelectorHook solves that
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector; this creates your own typed version of useSelector

with this instead of
useSelector(
  (state: RootState) => state.tasks.items
);

we can now write
useAppSelector(
  state => state.tasks.items
);

and then TS automatically knows state: RootState, so we can get the necessary autocompletes
*/

////////////////////////////////////////////////////////////////////////////
/*
What about useAppDispatch?

with const dispatch = useDispatch()
The returned dispatch does not necessarily know all the specific types associated with your store
so we could manually write
const dispatch = useDispatch<AppDispatch>() everywhere

instead define
export const useAppDispatch = () => useDispatch<AppDispatch>();

Now components can simply do
const dispatch = useAppDispatch()

and now when we write
dispatch(setFilterStatus("completed"));

TS understands the action and if the action expects say "all" | "pending" | "completed"
dispatch(setFilterStatus("something-else")); this will get caught

The mental modal to understand is
useSelector - Give me something from the Redux store
useAppSelector - Give me something from my application's specifically typed Redux store

useDispatch - Give me Redux's dispatch function
useAppDispatch - Give me the dispatch function configured for my application

So hooks.ts doesn't add new Redux functionality. It creates a small, typed convenience layer around React Redux's existing hooks.
*/