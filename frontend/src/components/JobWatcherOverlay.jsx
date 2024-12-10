import React from 'react'
import '../css/JobWatcherOverlay.css';
import useJobWatcher from '../context/useJobWatcher';

const JobWatcherOverlay = () => {
    const {
        currentJobEta,
        currentJobId,
        currentJobResult,
        currentJobStatus,
        currentJobSubmittedAt,
        currentQueuePosition
    } = useJobWatcher();
    return (
        <div className='job-watcher-overlay'>
            <h4>
                Job {JSON.stringify(currentJobId)} {JSON.stringify(currentJobStatus)}
            </h4>
            <p>
                Eta: {JSON.stringify(currentJobEta)}
            </p>
            <p>
                Submitted at: {JSON.stringify(currentJobSubmittedAt)}
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