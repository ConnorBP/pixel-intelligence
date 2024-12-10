import { createContext, useContext } from 'react';

export const JobWatcherContext = createContext(null);

// context provider for watching image request jobs no matter what page you are on
export const useJobWatcher = () => {
    const {
        currentJobId,
        currentJobStatus,
        currentJobSubmittedAt,
        currentJobEta,
        currentQueuePosition,
        currentJobResult,
        submitJob,
    } = useContext(JobWatcherContext);

    return {
        currentJobStatus, // can be 'idle', 'running', 'completed', 'failed'
        currentJobId, // stores the string id of the current job
        currentJobSubmittedAt, // stores utc timestamp of when the job was submitted
        currentJobEta, // stores utc timestamp of when the job is expected to complete
        currentQueuePosition, // stores the current position in the queue if the job is still running
        currentJobResult, // stores the result of the job if it has completed, or the error if it failed
        submitJob, // function to submit a new job id
    };
};

export default useJobWatcher;