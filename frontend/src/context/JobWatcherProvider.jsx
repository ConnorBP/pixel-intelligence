import { useCallback, useEffect, useReducer, useState } from 'react';
import checkGeneration from '../api/checkGeneration';
import fetchGeneration from '../api/fetchGeneration';

import { JobWatcherContext } from './useJobWatcher';
import { getStorageValue } from '../hooks/useLocalStorage';

const jobWatcherReducer = (state, action) => {
    console.log('job watch update', JSON.stringify(action));
    switch (action.type) {
        case 'start':
            return {
                ...state,
                currentJobId: action.jobId,
                canvasSize: action.canvasSize,
                currentJobStatus: 'running',
                currentJobSubmittedAt: Date.now(),
                currentJobWaitTime: 0,
                currentJobEta: 0,
                currentJobResult: null,
            };
        case 'update':
            return {
                ...state,
                lastRequestStatus: action.responseStatus,
                currentJobWaitTime: action.wait_time,
                currentJobEta: action.eta,
                currentJobResult: action.result,
            };
        case 'fetch':
            return {
                ...state,
                currentJobStatus: 'fetching',
            };
        case 'complete':
            return {
                ...state,
                currentJobStatus: 'completed',
                currentJobResult: action.result,
            };
        case 'fail':
            return {
                ...state,
                currentJobStatus: 'failed',
                currentJobResult: action.error,
            };
        case 'clear':
            return {
                ...state,
                currentJobId: null,
                canvasSize: null,
                currentJobStatus: 'idle',
                currentJobSubmittedAt: 0,
                currentJobWaitTime: 0,
                currentJobEta: 0,
                currentJobResult: null,
            };
        default:
            return state;
    }
};

// this is the job watcher provider.
// it takes in a minimum and maximum interval for checking the job status
// the actual time waited between checks may vary depending on the eta in the job status response
export const JobWatcherProvider = ({ children, jobCheckIntervalMsMin = 5000, jobCheckIntervalMsMax = 30000 }) => {

    const [state, dispatch] = useReducer(jobWatcherReducer, getStorageValue('currentJobStatus', {
        currentJobId: null,
        canvasSize: null,
        currentJobStatus: 'idle',
        currentJobSubmittedAt: 0,
        currentJobWaitTime: 0,
        currentJobEta: 0,
        currentQueuePosition: 0,
        currentJobResult: null,
    }));

    // track if we already have a check in progress so we don't start multiple
    // timeout recursions
    const [checkingGeneration, setCheckingGeneration] = useState(false);

    // make sure job state persists across page reloads
    useEffect(() => {
        const strout = JSON.stringify(state);
        localStorage.setItem('currentJobStatus', strout);
    }, [state])

    const pollJobStatus = useCallback(async (jobId) => {
        try {
            const response = await checkGeneration(jobId);
            if (response.success) {
                if (response.status === 'completed') {
                    dispatch({ type: 'fetch' });
                } else {
                    dispatch({
                        type: 'update',
                        responseStatus: response.status,
                        wait_time: response.wait_time,
                        eta: Date.now() + (response.wait_time * 1000),
                        position: response.queue_position,
                        result: response.result
                    });
                }
            } else {
                dispatch({ type: 'fail', error: response.error });
            }
        } catch (error) {
            dispatch({ type: 'fail', error: error.message });
        }
    }, []);

    const pollJobStatusWithInterval = useCallback((jobId) => {
        if (state.currentJobStatus === 'running') {
            const timeOutLength =
                Math.min(
                    Math.max(
                        state.currentJobWaitTime || jobCheckIntervalMsMin,
                        jobCheckIntervalMsMin
                    ),
                    jobCheckIntervalMsMax
                );
            setTimeout(() => {
                console.log('polling job status');
                if (state.currentJobStatus === 'running') {
                    console.log('polling job status in timeout');
                    pollJobStatus(state.currentJobId);
                }
            }, timeOutLength);
        } else {
            setCheckingGeneration(false);
        }
    }, [state.currentJobStatus, state.currentJobId, , state.currentJobWaitTime, jobCheckIntervalMsMin, jobCheckIntervalMsMax.pollJobStatus]);

    useEffect(() => {
        if (state.currentJobStatus === 'running') {
            if (!checkingGeneration) {
                setCheckingGeneration(true);
                pollJobStatusWithInterval(state.currentJobId);
            }
        } else if (state.currentJobStatus === 'fetching') {
            fetchGeneration(state.currentJobId).then((response) => {
                if (response.success) {
                    dispatch({ type: 'complete', result: response });
                } else {
                    dispatch({ type: 'fail', error: response.error });
                }
            });

        }
    }, [state.currentJobStatus, state.currentJobId, pollJobStatus]);

    const submitJob = (jobId, canvasSize) => {
        dispatch({ type: 'start', jobId, canvasSize });
    };

    const clearJob = () => {
        dispatch({ type: 'clear' });
    };

    return (
        <JobWatcherContext.Provider value={{ ...state, submitJob, clearJob }}>
            {children}
        </JobWatcherContext.Provider>
    );
};

export default JobWatcherProvider;