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

    // const [testStartTime, setTestStartTime] = React.useState(new Date().getTime());
    // const [testEndTime, setTestEndTime] = React.useState(new Date().getTime() + 10000);

    const updatePercent = () => {
        // console.log('updating percent');
        let percent = 0;
        if (currentJobEta && currentJobSubmittedAt) {
            const totalWaitTime = currentJobEta - currentJobSubmittedAt;
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