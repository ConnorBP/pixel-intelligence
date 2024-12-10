import React from 'react'
import '../css/JobWatcherOverlay.css';
import useJobWatcher from '../context/useJobWatcher';

const JobWatcherOverlay = () => {
    const {
        currentJobEta,
        currentJobId,
        currentJobResult,
        currentJobStatus,
        currentJobWaitTime,
        currentJobSubmittedAt,
        currentQueuePosition
    } = useJobWatcher();
    return (
        <div className='job-watcher-overlay'>
            <h4>
                Job {JSON.stringify(currentJobId)} {JSON.stringify(currentJobStatus)}
            </h4>
            <p>
                Eta: {currentJobEta ? new Date(currentJobEta).toLocaleTimeString() : 'N/A'}
            </p>
            <p>
                Wait Time: {JSON.stringify(currentJobWaitTime)}
            </p>
            <p>
                Submitted at: {currentJobSubmittedAt ? new Date(currentJobSubmittedAt).toLocaleTimeString() : 'N/A'}
            </p>
            <p>
                Queue position: {JSON.stringify(currentQueuePosition)}
            </p>
            <p>
                Result: {JSON.stringify(currentJobResult)}
            </p>
        </div>
    )
}

export default JobWatcherOverlay