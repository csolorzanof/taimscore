import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../AuthProvider'
import { useContext, useEffect, useState } from 'react'
import { LoginResponseDTO } from '../DTOs/LoginResponseDTO'
import { VerifyTokenDTO } from '../DTOs/VerifyTokenDTO'
import { AlertsContext } from '../components/alerts/Alerts-Context'
import { useMsal } from '@azure/msal-react'
import { AccountInfo } from '@azure/msal-browser'
import { loginRequest } from '../MSALConfig'
import { VerifyMSALAccountDTO } from '../DTOs/VerifyMSALAccountDTO'
import MicrosoftIcon from '../assets/microsoft.svg'
import { Spinner } from '@material-tailwind/react'
import HispiLogo from '../assets/hispi.png'
import LicAgreementPDF from '../assets/TAIMSCORE_LicenseAgreement-09-09-2024.pdf'
import PrivPolicyPDF from '../assets/TAIMSCORE_PrivacyPolicy_09-09-2024.pdf'

const apiBaseURL = import.meta.env.VITE_BackendURL

const LandingPage = () => {
    const { setToken, setUser, setLoginResponse } = useContext(AuthContext)
    const { addAlert } = useContext(AlertsContext)
    const navigate = useNavigate()
    const { instance } = useMsal()
    const [account, setAccount] = useState<AccountInfo | null>(null)
    const [authenticatingMS, setAuthenticatingMS] = useState(false)
    const [taglineComplete, setTaglineComplete] = useState(false)

    const handleMSLogin = () => {
        setAuthenticatingMS(true)
        instance
            .loginPopup(loginRequest)
            .then((response) => {
                console.log(response)
                setAccount(response.account)
            })
            .catch((e) => {
                console.error(e)
            })
    }

    const googleSuccess = async (response: any) => {
        const clientId = response.clientId
        const credential = response.credential
        const verifyPayload: VerifyTokenDTO = {
            token: credential,
        }
        const verifyResponse = await axios.post(
            `${apiBaseURL}/verifyGoogleToken`,
            verifyPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        const loginResponse: LoginResponseDTO = verifyResponse.data
        if (loginResponse.redirectToRegister) {
            setLoginResponse(loginResponse)
            navigate('/register')
        } else {
            setToken(loginResponse.token)
            setUser({
                userId: loginResponse.userId,
                email: loginResponse.email,
                name: loginResponse.name,
                pictureUrl: loginResponse.pictureUrl,
                locale: loginResponse.locale,
                familyName: loginResponse.familyName,
                givenName: loginResponse.givenName,
                authProviderId: loginResponse.authProviderId,
            })
            navigate('/secure/landing')
        }
    }

    const googleFailure = () => {
        addAlert({
            id: 'google-sign-in-failed',
            severity: 'error',
            message: 'Google Sign In was unsuccessful. Try again later',
            timeout: 5,
            handleDismiss: null,
        })
    }

    useEffect(() => {
        if (account) {
            instance
                .acquireTokenSilent({
                    scopes: ['openid', 'profile', 'User.Read'],
                    account: account,
                })
                .then((response) => {
                    const userName = response.account.username
                    const uniqueId = response.uniqueId
                    const token = response.accessToken

                    const verifyMSALAccountDTO: VerifyMSALAccountDTO = {
                        UserName: userName,
                        UniqueId: uniqueId,
                        Token: token,
                    }

                    axios
                        .post(
                            `${apiBaseURL}/verifyMSALAccount`,
                            verifyMSALAccountDTO
                        )
                        .then((response) => {
                            setAuthenticatingMS(false)
                            const loginResponse: LoginResponseDTO =
                                response.data
                            if (loginResponse.redirectToRegister) {
                                setLoginResponse(loginResponse)
                                navigate('/register')
                            } else {
                                setToken(loginResponse.token)
                                setUser({
                                    userId: loginResponse.userId,
                                    email: loginResponse.email,
                                    name: loginResponse.name,
                                    pictureUrl: loginResponse.pictureUrl,
                                    locale: loginResponse.locale,
                                    familyName: loginResponse.familyName,
                                    givenName: loginResponse.givenName,
                                    authProviderId:
                                        loginResponse.authProviderId,
                                })
                                navigate('/secure/landing')
                            }
                        })
                        .catch((error) => {
                            setAuthenticatingMS(false)
                            console.error(error)
                            addAlert({
                                id: 'verify-msal-account-failed',
                                severity: 'error',
                                message:
                                    'Microsoft login failed. Try again later',
                                timeout: 5,
                                handleDismiss: null,
                            })
                        })
                })
                .catch((e) => {
                    setAuthenticatingMS(false)
                    console.error(e)
                    addAlert({
                        id: 'msal-acquire-token-silent-failed',
                        severity: 'error',
                        message: 'Microsoft login failed. Try again later',
                        timeout: 5,
                        handleDismiss: null,
                    })
                })
        }
    }, [account, instance])

    useEffect(() => {
        const interval = setTimeout(() => {
            setTaglineComplete(true)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="container mx-auto flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold mt-10">TAIMSCORE</h1>
            <img src={HispiLogo} alt="Hispi" className="w-40 h-40" />
            {!taglineComplete && (
                <h2>
                    Building Trust in an{' '}
                    <span className="text-flicker-out-glow font-bold">Un</span>
                    certain World!
                </h2>
            )}
            {taglineComplete && (
                <h2>
                    Building Trust in an <span className="font-bold">Ai</span>
                    certain World!
                </h2>
            )}
            <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                cancel_on_tap_outside={true}
                theme="filled_black"
            />

            <button
                onClick={handleMSLogin}
                className="bg-blue-700 p-2 text-white rounded w-60 flex flex-row items-center justify-center"
            >
                {authenticatingMS && (
                    <Spinner color="white" size="sm" className="mr-2" />
                )}
                <img
                    src={MicrosoftIcon}
                    alt="Microsoft"
                    className="w-6 h-6 inline-block mr-2"
                />
                Sign In with Microsoft
            </button>
            <div className="flex flex-row">
                <a
                    href={LicAgreementPDF}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                >
                    License Agreement
                </a>
                <span className="mx-2">|</span>
                <a
                    href={PrivPolicyPDF}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                >
                    Privacy Policy
                </a>
            </div>
        </div>
    )
}

export default LandingPage
