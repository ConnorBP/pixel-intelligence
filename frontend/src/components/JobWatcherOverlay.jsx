import React, { useState } from 'react'
import '../css/JobWatcherOverlay.css';
import useJobWatcher from '../context/useJobWatcher';
import ProgressBar from './ProgressBar';
import useRecursiveTimeout from '../hooks/useRecursiveHook';

// how many milliseconds to wait before updating the percent display
const updatePercentEvery = 300;

const JobWatcherOverlay = () => {
    // only show job watcher overlay on development build
    if (import.meta.env.MODE !== 'development') {
        return null;
    }

    const {
        currentJobEta,
        currentJobId,
        currentJobResult,
        currentJobStatus,
        currentJobWaitTime,
        currentJobSubmittedAt,
        currentQueuePosition,
        clearJob
    } = useJobWatcher();

    const [currentPercent, setCurrentPercent] = React.useState(0);
    const [showCancelJobPopup, setShowCancelJobPopup] = useState(false);

    // const [testStartTime, setTestStartTime] = React.useState(new Date().getTime());
    // const [testEndTime, setTestEndTime] = React.useState(new Date().getTime() + 10000);

    const updatePercent = () => {
        // console.log('updating percent');
        let percent = 0;
        if (currentJobEta && currentJobSubmittedAt) {
            var totalWaitTime = currentJobEta - currentJobSubmittedAt;
            // add an extra buffer to the total wait time estimate
            totalWaitTime *= 1.1;
            const currentWaitTime = new Date().getTime() - currentJobSubmittedAt;
            percent = currentWaitTime / totalWaitTime;
            setCurrentPercent(percent);
        }
        // const totalWaitTime = testEndTime - testStartTime;
        // const currentWaitTime = new Date().getTime() - testStartTime;
        // const percent = currentWaitTime / totalWaitTime;
        // setCurrentPercent(percent);

        // break out of recursive timeout on completion
        if (percent >= 1) {
            return true;
        }
    };

    // update on timer
    useRecursiveTimeout(updatePercent, updatePercentEvery, [currentJobEta, currentJobSubmittedAt]);

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
            <ProgressBar percent={currentPercent} />
            <button
                className="clear-job-btn"
                onClick={() => setShowPopup(true)}
            >
                Clear Job
            </button>
            {/* Custom Job Popup Overlay */}
            {showCancelJobPopup && (
                <div className="clear-job-popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Image Job Clear!</h3>
                        <p>Are you sure you want to clear the current image generation job?</p>
                        <div className='popup-actions'>
                            <button
                                className="confirm-btn"
                                onClick={() => {
                                    clearJob();
                                    setShowCancelJobPopup(false);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setShowCancelJobPopup(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobWatcherOverlay