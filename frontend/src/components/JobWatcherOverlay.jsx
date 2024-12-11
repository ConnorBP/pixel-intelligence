import React from 'react'
import '../css/JobWatcherOverlay.css';
import useJobWatcher from '../context/useJobWatcher';
import ProgressBar from './ProgressBar';
import useRecursiveTimeout from '../hooks/useRecursiveHook';

// how many milliseconds to wait before updating the percent display
const updatePercentEvery = 300;

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

    const [currentPercent, setCurrentPercent] = React.useState(0);

    // const [testStartTime, setTestStartTime] = React.useState(Date.now());
    // const [testEndTime, setTestEndTime] = React.useState(Date.now() + 10000);

    const updatePercent = () => {
        console.log('updating percent');
        if (currentJobEta && currentJobSubmittedAt) {
            const totalWaitTime = currentJobEta - currentJobSubmittedAt;
            const currentWaitTime = Date.now() - currentJobSubmittedAt;
            const percent = currentWaitTime / totalWaitTime;
            setCurrentPercent(percent);
        }
        // const totalWaitTime = testEndTime - testStartTime;
        // const currentWaitTime = Date.now() - testStartTime;
        // const percent = currentWaitTime / totalWaitTime;
        // setCurrentPercent(percent);

        // break out of recursive timeout on completion
        if (percent >= 1) {
            return true;
        }
    };

    // update on timer
    useRecursiveTimeout(updatePercent, updatePercentEvery);

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
        </div>
    )
}

export default JobWatcherOverlay