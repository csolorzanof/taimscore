import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../AuthProvider'
import { Navigate, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { AlertsContext } from '../components/alerts/Alerts-Context'

type PrivateRouteProps = {}

const PrivateRoute = (props: PropsWithChildren<PrivateRouteProps>) => {
    const { token } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    if (token) {
        const decodedToken: { exp: number } = jwtDecode(token)
        const isTokenExpired = decodedToken.exp * 1000 < Date.now()

        if (isTokenExpired) {
            addAlert({
                id: 'session-expired',
                severity: 'error',
                message: 'Your session has expired. Please log in again.',
                timeout: 5,
                handleDismiss: null,
            })
            return <Navigate to="/" />
        }

        return props.children
    }

    return <Navigate to="/" />
}

export default PrivateRoute
