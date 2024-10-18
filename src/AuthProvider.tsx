import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { LoggedInUser } from './types/LoggedInUser'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store/store'
import { setToken, setUser } from './store/authSlice'
import { LoginResponseDTO } from './DTOs/LoginResponseDTO'
import { ImportAssessmentStandardResultDTO } from './DTOs/ImportAssessmentStandardResultDTO'
import { AssessmentWithMappingsDTO } from './DTOs/AssessmentWithMappingsDTO'
import { AssessmentImportDoneDTO } from './DTOs/AssessmentImportDoneDTO'
import { jwtDecode } from 'jwt-decode'

type AuthContextType = {
    token: string | null
    setToken: (token: string | null) => void
    user: LoggedInUser | null
    setUser: (user: LoggedInUser | null) => void
    loginResponse: LoginResponseDTO | null
    setLoginResponse: (loginResponse: LoginResponseDTO | null) => void
    logout: () => void
    importData: ImportAssessmentStandardResultDTO | null
    setImportData: (
        importData: ImportAssessmentStandardResultDTO | null
    ) => void
    assessmentWithMappings: AssessmentWithMappingsDTO | null
    setAssessmentWithMappings: (
        assessmentWithMappings: AssessmentWithMappingsDTO | null
    ) => void
    assessmentImportDone: AssessmentImportDoneDTO | null
    setAssessmentImportDone: (
        assessmentImportDone: AssessmentImportDoneDTO | null
    ) => void
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

    const [importData, setImportData] =
        useState<ImportAssessmentStandardResultDTO | null>(null)

    const [assessmentWithMappings, setAssessmentWithMappings] =
        useState<AssessmentWithMappingsDTO | null>(null)

    const [assessmentImportDone, setAssessmentImportDone] =
        useState<AssessmentImportDoneDTO | null>(null)

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token)
            const expirationTime = decodedToken.exp! * 1000 - Date.now()
            const logoutTimeout = setTimeout(() => {
                setToken(null)
                setUser(null)
                // Add any additional logout logic here
            }, expirationTime)

            return () => clearTimeout(logoutTimeout)
        }
    }, [token])

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
        assessmentWithMappings,
        setAssessmentWithMappings,
        assessmentImportDone,
        setAssessmentImportDone,
    }

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
