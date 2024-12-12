import React from 'react'
import { SessionProvider } from './SessionContext'
import { Outlet } from 'react-router-dom'
import ImageDetailsProvider from './ImageDetailsProvider'
import JobWatcherProvider from './JobWatcherProvider'
import JobWatcherOverlay from '../components/JobWatcherOverlay'
import ProgressToastOverlay from '../components/ProgressToastOverlay'

// this nicely wraps the entire app in the context providers
// these are useful for cases where you need the same persistent 
// context across multiple pages and component levels
// this wraps all routes including the editor
const ContextRouteWrapper = () => {
    return (
        <SessionProvider>
            <ImageDetailsProvider>
                <JobWatcherProvider>
                    <Outlet />
                    <JobWatcherOverlay />
                    <ProgressToastOverlay />
                </JobWatcherProvider>
            </ImageDetailsProvider>
        </SessionProvider>
    )
}

export default ContextRouteWrapper