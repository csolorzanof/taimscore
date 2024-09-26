import { createContext, useState, PropsWithChildren } from 'react'
import { Alert, AlertsWrapper } from './Alert'

export type AlertsType = {
    id: string
    severity: 'error' | 'warning' | 'info' | 'success'
    message: string
    timeout: number
    handleDismiss: null | (() => void)
}

type AlertsContextType = {
    alerts: AlertsType[]
    setAlerts: React.Dispatch<React.SetStateAction<AlertsType[]>>
    addAlert: (alert: AlertsType) => string
    dismissAlert: (id: string) => void
}

export const AlertsContext = createContext({} as AlertsContextType)
type AlertsProviderProps = {}

const AlertsProvider = (props: PropsWithChildren<AlertsProviderProps>) => {
    const [alerts, setAlerts] = useState<AlertsType[]>([])

    const addAlert = (alert: AlertsType) => {
        let id = ''
        if (alert.id === undefined) {
            id =
                Math.random().toString(36).slice(2, 9) +
                new Date().getTime().toString(36)
        } else {
            id = alert.id
        }
        if (!alerts.find((alert) => alert.id === id))
            setAlerts((prevAlerts) => [...prevAlerts, { ...alert, id }])
        return id
    }

    const dismissAlert = (id: string) => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id))
    }

    const alertsValue = {
        alerts,
        setAlerts,
        addAlert,
        dismissAlert,
    }

    return (
        <AlertsContext.Provider value={alertsValue}>
            <AlertsWrapper>
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        {...alert}
                        handleDismiss={() => dismissAlert(alert.id)}
                    />
                ))}
            </AlertsWrapper>
            {props.children}
        </AlertsContext.Provider>
    )
}

export default AlertsProvider
