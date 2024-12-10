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
                Job {currentJobId} {currentJobStatus}
            </h4>
            <p>
                Eta: {currentJobEta}
            </p>
            <p>
                Submitted at: {currentJobSubmittedAt}
            </p>
            <p>
                Queue position: {currentQueuePosition}
            </p>
            <p>
                Result: {currentJobResult}
            </p>
        </div>
    )
}

export default JobWatcherOverlay