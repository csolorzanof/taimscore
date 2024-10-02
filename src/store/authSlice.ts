import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoggedInUser } from '../types/LoggedInUser'

interface AuthState {
    token: string | null
    user: LoggedInUser | null
}

const initialState: AuthState = {
    token: null,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload
        },
        setUser: (state, action: PayloadAction<LoggedInUser | null>) => {
            state.user = action.payload
        },
    },
})

export const { setToken, setUser } = authSlice.actions
export default authSlice.reducer
