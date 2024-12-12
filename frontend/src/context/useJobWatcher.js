import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const JobWatcherContext = createContext(null);

// context provider for watching image request jobs no matter what page you are on
export const useJobWatcher = () => {
    const {
        currentJobId,
        canvasSize,
        currentJobStatus,
        currentJobSubmittedAt,
        currentJobEta,
        currentJobWaitTime,
        currentQueuePosition,
        currentJobResult,
        currentTimeoutLength,
        submitJob,
        clearJob,
    } = useContext(JobWatcherContext);

    return {
        currentJobStatus, // can be 'idle', 'running', 'fetching', 'completed', 'failed'
        currentJobId, // stores the string id of the current job
        canvasSize, // stores the size of the canvas that the job is for
        currentJobSubmittedAt, // stores utc timestamp of when the job was submitted
        currentJobEta, // stores utc timestamp of when the job is expected to complete
        currentJobWaitTime,
        currentQueuePosition, // stores the current position in the queue if the job is still running
        currentJobResult, // stores the result of the job if it has completed, or the error if it failed
        currentTimeoutLength, // how long until we will next poll the api for an update
        submitJob, // function to submit a new job id
        clearJob, // function to clear the current job data once done with it
    };
};

export default useJobWatcher;