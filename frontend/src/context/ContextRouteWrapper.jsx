import React from 'react'
import { SessionProvider } from './SessionContext'
import { Outlet } from 'react-router-dom'
import ImageDetailsProvider from './ImageDetailsProvider'

const ContextRouteWrapper = () => {
    return (
        <SessionProvider>
            <ImageDetailsProvider>
                <Outlet />
            </ImageDetailsProvider>
        </SessionProvider>
    )
}

export default ContextRouteWrapper