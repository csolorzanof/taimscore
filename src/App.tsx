import { RouterProvider } from 'react-router-dom'
import Router from './routes/router'
import AuthProvider from './AuthProvider'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import AlertsProvider from './components/alerts/Alerts-Context'

function App() {
    return (
        <AlertsProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider>
                        <RouterProvider router={Router} />
                    </AuthProvider>
                </PersistGate>
            </Provider>
        </AlertsProvider>
    )
}

export default App
