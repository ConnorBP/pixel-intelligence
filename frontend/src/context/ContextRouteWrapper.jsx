import React from 'react'
import { SessionProvider } from './SessionContext'
import { Outlet } from 'react-router-dom'
import { ImageDetailsProvider } from './ImageDetailsContext'

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