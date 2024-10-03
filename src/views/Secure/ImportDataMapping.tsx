import React, { useContext } from 'react'
import { AuthContext } from '../../AuthProvider'

const ImportDataMapping = () => {
    const { token, importData } = useContext(AuthContext)

    return <div className="container"></div>
}

export default ImportDataMapping
