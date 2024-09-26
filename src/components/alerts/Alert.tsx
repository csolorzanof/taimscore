import { PropsWithChildren, useEffect } from 'react'
import { classNames, svgFillColors, svgPaths } from './Severity-Styles'

type AlertProps = {
    message: string
    severity: 'error' | 'warning' | 'info' | 'success'
    timeout: number
    handleDismiss: null | (() => void)
}

const Alert = ({
    message = '',
    severity = 'info',
    timeout = 0,
    handleDismiss = null,
}: AlertProps) => {
    useEffect(() => {
        if (timeout > 0 && handleDismiss) {
            const timer = setTimeout(() => {
                handleDismiss()
            }, timeout * 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    return (
        message?.length && (
            <div
                className={
                    classNames[severity] +
                    ' rounded-b px-4 py-3 mb-4 shadow-md pointer-events-auto'
                }
                role={'alert'}
            >
                <div className="flex">
                    <div className="py-1">
                        <svg
                            className={`h-6 w-6 ${svgFillColors[severity]}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d={svgPaths[severity]} />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold">{severity.toUpperCase()}</p>
                        <p className="text-sm">{message}</p>
                    </div>
                    <div className="ml-auto">
                        {handleDismiss && (
                            <button
                                className="text-sm font-bold"
                                type={'button'}
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleDismiss()
                                }}
                            >
                                <svg
                                    className="fill-current h-6 w-6 text-gray-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M6.83 5L10 8.17 13.17 5 15 6.83 11.83 10 15 13.17 13.17 15 10 11.83 6.83 15 5 13.17 8.17 10 5 6.83 6.83 5z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    )
}

type AlertsWrapperProps = {}

const AlertsWrapper = (props: PropsWithChildren<AlertsWrapperProps>) => {
    return (
        <div className="fixed top-0 right-0 p-4 z-50 pointer-events-none max-w-sm min-w-fit w-full">
            {props.children}
        </div>
    )
}

export { Alert, AlertsWrapper }
