import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './MSALConfig.tsx'
import App from './App.tsx'
import './index.css'
console.log('MSALConfig:', msalConfig)
const msalInstance = new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GoogleClientID}>
        <MsalProvider instance={msalInstance}>
            {/* <StrictMode> */}
            <App />
            {/* </StrictMode> */}
        </MsalProvider>
    </GoogleOAuthProvider>
)
