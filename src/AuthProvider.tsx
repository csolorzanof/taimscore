import { createContext, PropsWithChildren, useState } from 'react'
import { LoggedInUser } from './types/LoggedInUser'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store'
import { setToken, setUser } from './store/authSlice'
import { LoginResponseDTO } from './DTOs/LoginResponseDTO'

type AuthContextType = {
    token: string | null
    setToken: (token: string | null) => void
    user: LoggedInUser | null
    setUser: (user: LoggedInUser | null) => void
    loginResponse: LoginResponseDTO | null
    setLoginResponse: (loginResponse: LoginResponseDTO | null) => void
    logout: () => void
    importData: any
    setImportData: any
}

export const AuthContext = createContext({} as AuthContextType)

type AuthProviderProps = {}

const AuthProvider = (props: PropsWithChildren<AuthProviderProps>) => {
    const dispatch = useDispatch()
    const token = useSelector((state: RootState) => state.auth.token)
    const user = useSelector((state: RootState) => state.auth.user)
    const [loginResponse, setLoginResponse] = useState<LoginResponseDTO | null>(
        null
    )

    const [importData, setImportData] = useState<any>(null)

    const authValue = {
        token,
        setToken: (token: string | null) => dispatch(setToken(token)),
        user,
        setUser: (user: LoggedInUser | null) => dispatch(setUser(user)),
        loginResponse,
        setLoginResponse,
        logout: () => {
            dispatch(setToken(null))
            dispatch(setUser(null))
        },
        importData,
        setImportData,
    }

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
