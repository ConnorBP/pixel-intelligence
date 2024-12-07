import React from 'react'
import { SessionProvider } from './SessionContext'
import { Outlet } from 'react-router-dom'

const ContextRouteWrapper = () => {
    return (
        <SessionProvider>
            <Outlet />
        </SessionProvider>
    )
}

export default ContextRouteWrapper