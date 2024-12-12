import { useEffect, useState } from 'react'
import "../css/ProgressToastOverlay.css";
import useJobWatcher from '../context/useJobWatcher';
import ProgressBar from './ProgressBar';
import useRecursiveTimeout from '../hooks/useRecursiveHook';
import "../css/ClearJobOverlay.css";

// how many milliseconds to wait before updating the percent display
const updatePercentEvery = 300;
const extraTimeBufferFactor = 1.2;

const ProgressToastOverlay = () => {
    const {
        currentJobEta,
        currentJobStatus,
        currentJobSubmittedAt,
        currentQueuePosition
    } = useJobWatcher();

    const [currentPercent, setCurrentPercent] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState("N/A");
    const [showCancelJobPopup, setShowCancelJobPopup] = useState(false);
    const [nextPollTime, setNextPollTime] = useState(new Date().getTime() + currentTimeoutLength);

    useEffect(() => {
        setNextPollTime(new Date().getTime() + currentTimeoutLength);
    }, [currentTimeoutLength]);

    const updatePercent = () => {
        // console.log('updating percent');
        let percent = 0;
        if (currentJobEta && currentJobSubmittedAt) {
            var totalWaitTime = Math.max(currentJobEta, nextPollTime) - currentJobSubmittedAt
            // add an extra buffer to the total wait time estimate
            totalWaitTime *= extraTimeBufferFactor;
            const currentWaitTime = new Date().getTime() - currentJobSubmittedAt;

            var timeUntilEta = currentJobEta - new Date().getTime();
            timeUntilEta *= extraTimeBufferFactor;

            // update the display of time remaining
            const seconds = Math.floor((timeUntilEta / 1000) % 60);
            const minutes = Math.floor((timeUntilEta / (1000 * 60)) % 60);
            const mDisplay = minutes > 0 ? `${minutes}m ` : '';
            setTimeRemaining(`${mDisplay}${seconds}s`);

            percent = currentWaitTime / totalWaitTime;
            setCurrentPercent(percent);
        }

        // break out of recursive timeout on progressbar completion
        if (percent >= 1) {
            return true;
        }
    };

    // update on timer (and reset it if currentJobEta or currentJobSubmittedAt changes)
    useRecursiveTimeout(updatePercent, updatePercentEvery, [currentJobEta, currentJobSubmittedAt, nextPollTime]);

    if (currentJobStatus === 'fetching') {
        return (
            <div className='progress-toast-overlay'>
                <h6>Done. Fetching...</h6>
            </div>
        );
    }

    if (currentJobStatus !== 'running') {
        return null;
    }

    return (
        <div className='progress-toast-overlay'>
            <div>Rendering... {currentQueuePosition > 1 ? `#${currentQueuePosition} in queue` : ''}</div>
            <div> eta: {timeRemaining}</div>
            <ProgressBar percent={currentPercent} />
            <button
                className="clear-job-btn"
                onClick={() => {
                    console.log("Cancel button clicked, showing popup...");
                    setShowCancelJobPopup(true);
                }}
            >
                Cancel
            </button>
            {/* Custom Job Popup Overlay */}
            {
                showCancelJobPopup && (
                    <div className="clear-job-popup-overlay">
                        <div className="popup-content">
                            <h3>Confirm Image Job Cancellation!</h3>
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
                )
            }
        </div >
    )
}

export default ProgressToastOverlay