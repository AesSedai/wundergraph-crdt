import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import hardSet from "redux-persist/lib/stateReconciler/hardSet"
import thunkMiddleware from "redux-thunk"
import authorSliceReducer from "../slices/authorSlice"
import { yjsTransform } from "../slices/yjsTransform"
import { storage } from "./storage"

const persistConfig = {
    key: "root",
    storage: storage(),
    transforms: [yjsTransform],
    stateReconciler: hardSet
}

const rootReducer = combineReducers({
    author: authorSliceReducer
})

export type RootReducer = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer<RootReducer>(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(thunkMiddleware)
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
