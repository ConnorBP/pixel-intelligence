import { useState } from 'react'
import "../css/ProgressToastOverlay.css";
import useJobWatcher from '../context/useJobWatcher';
import ProgressBar from './ProgressBar';
import useRecursiveTimeout from '../hooks/useRecursiveHook';

// how many milliseconds to wait before updating the percent display
const updatePercentEvery = 300;
const extraTimeBufferFactor = 1.2;

const ProgressToastOverlay = () => {
    const {
        currentJobEta,
        currentJobId,
        currentJobResult,
        currentJobStatus,
        currentJobWaitTime,
        currentJobSubmittedAt,
        currentQueuePosition
    } = useJobWatcher();

    const [currentPercent, setCurrentPercent] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState("N/A");

    const updatePercent = () => {
        // console.log('updating percent');
        let percent = 0;
        if (currentJobEta && currentJobSubmittedAt) {
            var totalWaitTime = currentJobEta - currentJobSubmittedAt;
            // add an extra buffer to the total wait time estimate
            totalWaitTime *= extraTimeBufferFactor;
            const currentWaitTime = new Date().getTime() - currentJobSubmittedAt;

            const timeUntilEta = currentJobEta - new Date().getTime();
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
    useRecursiveTimeout(updatePercent, updatePercentEvery, [currentJobEta, currentJobSubmittedAt]);

    return (
        <div className='progress-toast-overlay'>
            <div>Rendering...</div>
            <div> eta: {timeRemaining}</div>
            <ProgressBar percent={currentPercent} />
        </div>
    )
}

export default ProgressToastOverlay