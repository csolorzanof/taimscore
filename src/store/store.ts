import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from './authSlice'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authReducer),
})

const store = configureStore({
    reducer: rootReducer,
})

const persistor = persistStore(store)

export { store, persistor }
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
