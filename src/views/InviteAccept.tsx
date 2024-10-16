import { GoogleLogin } from '@react-oauth/google'
import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { InviteDTO } from '../DTOs/InviteDTO'
import { AlertsContext } from '../components/alerts/Alerts-Context'
import { useMsal } from '@azure/msal-react'
import { AccountInfo } from '@azure/msal-browser'
import MicrosoftIcon from '../assets/microsoft.svg'
import { Spinner } from '@material-tailwind/react'
import LicAgreementPDF from '../assets/TAIMSCORE_LicenseAgreement-09-09-2024.pdf'
import PrivPolicyPDF from '../assets/TAIMSCORE_PrivacyPolicy_09-09-2024.pdf'
import { VerifyTokenDTO } from '../DTOs/VerifyTokenDTO'
import { loginRequest } from '../MSALConfig'
import { VerifyMSALAccountDTO } from '../DTOs/VerifyMSALAccountDTO'
import { LoginResponseDTO } from '../DTOs/LoginResponseDTO'
import { AuthContext } from '../AuthProvider'

const apiBaseURL = import.meta.env.VITE_BackendURL

const InviteAccept = () => {
    const { setToken, setUser, setLoginResponse } = useContext(AuthContext)
    const { inviteCode } = useParams()
    const [inviteDetails, setInviteDetails] = useState<InviteDTO | null>(null)
    const navigate = useNavigate()
    const { addAlert } = useContext(AlertsContext)
    const [authenticatingMS, setAuthenticatingMS] = useState(false)
    const { instance } = useMsal()
    const [account, setAccount] = useState<AccountInfo | null>(null)

    const handleMSLogin = () => {
        setAuthenticatingMS(true)
        instance
            .loginPopup(loginRequest)
            .then((response: any) => {
                console.log(response)
                setAccount(response.account)
            })
            .catch((e: any) => {
                console.error(e)
            })
    }

    const googleSuccess = async (response: any) => {
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
            try {
                const verifyResponse = await axios.post(
                    `${apiBaseURL}/invites/use/${inviteCode}`,
                    null,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (verifyResponse.status !== 200) {
                    addAlert({
                        id: 'invite-fetch-failed',
                        severity: 'error',
                        message:
                            'Invite code has already been used or has expired.',
                        timeout: 5,
                        handleDismiss: null,
                    })
                    navigate('/')
                } else {
                    setLoginResponse({
                        ...loginResponse,
                        tenantId: inviteDetails?.tenantId!,
                        inviteCode: inviteCode,
                    })
                    navigate('/register')
                }
            } catch (e) {
                addAlert({
                    id: 'invite-fetch-failed',
                    severity: 'error',
                    message:
                        'Invite code has already been used or has expired.',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/')
            }
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
                tenantId: loginResponse.tenantId,
                isSaasAdmin: loginResponse.isSaasAdmin,
                isTenantAdmin: loginResponse.isTenantAdmin,
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
        const doVerify = async () => {
            instance
                .acquireTokenSilent({
                    scopes: ['openid', 'profile', 'User.Read'],
                    account: account!,
                })
                .then((response: any) => {
                    const userName = response.account.username

                    if (userName !== inviteDetails?.email) {
                        addAlert({
                            id: 'invite-email-mismatch',
                            severity: 'error',
                            message:
                                'The email address in the invite does not match the email address of the account you are trying to sign in with.',
                            timeout: 5,
                            handleDismiss: null,
                        })
                        return
                    }

                    const verifyResponse = axios.post(
                        `${apiBaseURL}/invites/use/${inviteCode}`,
                        null,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    )

                    verifyResponse
                        .then(() => {
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
                                        setLoginResponse({
                                            ...loginResponse,
                                            tenantId: inviteDetails?.tenantId!,
                                            inviteCode: inviteCode,
                                        })
                                        navigate('/register')
                                    } else {
                                        setToken(loginResponse.token)
                                        setUser({
                                            userId: loginResponse.userId,
                                            email: loginResponse.email,
                                            name: loginResponse.name,
                                            pictureUrl:
                                                loginResponse.pictureUrl,
                                            locale: loginResponse.locale,
                                            familyName:
                                                loginResponse.familyName,
                                            givenName: loginResponse.givenName,
                                            authProviderId:
                                                loginResponse.authProviderId,
                                            tenantId: loginResponse.tenantId,
                                            isSaasAdmin:
                                                loginResponse.isSaasAdmin,
                                            isTenantAdmin:
                                                loginResponse.isTenantAdmin,
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
                        .catch((e: any) => {
                            setAuthenticatingMS(false)
                            console.error(e)
                            addAlert({
                                id: 'msal-acquire-token-silent-failed',
                                severity: 'error',
                                message:
                                    'Invite code has already been used or is expired.',
                                timeout: 5,
                                handleDismiss: null,
                            })
                        })
                })
                .catch((e: any) => {
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

        if (account) {
            doVerify()
        }
    }, [account, instance])

    useEffect(() => {
        const fetchInviteDetails = async () => {
            try {
                const response = await axios.get(
                    `${
                        import.meta.env.VITE_BackendURL
                    }/invites/code/${inviteCode}`
                )
                if (response.status === 200) {
                    setInviteDetails(response.data)
                } else {
                    console.error(
                        'Failed to fetch invite details:',
                        response.statusText
                    )
                    addAlert({
                        id: 'invite-fetch-failed',
                        severity: 'error',
                        message:
                            'Invite code has already been used or has expired.',
                        timeout: 5,
                        handleDismiss: null,
                    })
                    navigate('/')
                }
            } catch (error) {
                console.error('Error fetching invite details:', error)
                addAlert({
                    id: 'invite-fetch-failed',
                    severity: 'error',
                    message:
                        'Invite code has already been used or has expired.',
                    timeout: 5,
                    handleDismiss: null,
                })
                navigate('/')
            }
        }

        fetchInviteDetails()
    }, [inviteCode])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-10">
                Tenant Invite
            </h1>
            <p>
                You have been invited to join one of TAIMSCORE's tenant:{' '}
                <span className="font-bold">{inviteDetails?.tenantName}</span>{' '}
                by{' '}
                <span className="font-bold text-blue-500">
                    {inviteDetails?.inviterName}
                </span>
                . To accept the invite please sign up through one of the
                following authorization providers:
            </p>
            <div className="flex flex-col gap-4 items-center mt-10">
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
                    {authenticatingMS && <Spinner className="h-4 w-4 mr-2" />}
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
        </div>
    )
}

export default InviteAccept
