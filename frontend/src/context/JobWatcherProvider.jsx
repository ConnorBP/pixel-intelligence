import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import checkGeneration from '../api/checkGeneration';
import fetchGeneration from '../api/fetchGeneration';

import { JobWatcherContext } from './useJobWatcher';
import { getStorageValue } from '../hooks/useLocalStorage';

const jobWatcherReducer = (state, action) => {
    switch (action.type) {
        case 'start':
            return {
                ...state,
                currentJobId: action.jobId,
                currentJobStatus: 'running',
                currentJobSubmittedAt: Date.now(),
                currentJobEta: null,
                currentJobResult: null,
            };
        case 'update':
            return {
                ...state,
                currentJobStatus: action.status,
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
        currentJobStatus: 'idle',
        currentJobSubmittedAt: null,
        currentJobEta: null,
        currentQueuePosition: null,
        currentJobResult: null,
    }));

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
                    dispatch({ type: 'update', status: response.status, eta: response.eta, result: response.result });
                }
            } else {
                dispatch({ type: 'fail', error: response.error });
            }
        } catch (error) {
            dispatch({ type: 'fail', error: error.message });
        }
    }, []);

    useEffect(() => {
        if (state.currentJobStatus === 'running') {
            // for now just use a fixed interval
            const interval = setInterval(() => {
                if (state.currentJobStatus === 'running') {
                    pollJobStatus(state.currentJobId);
                } else {
                    // clear self interval if job is no longer running
                    clearInterval(interval);
                }
            }, jobCheckIntervalMsMin);

            // return the cleanup function as our useEffect destructor
            return () => clearInterval(interval);
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

    const submitJob = (jobId) => {
        dispatch({ type: 'start', jobId });
    };

    return (
        <JobWatcherContext.Provider value={{ ...state, submitJob }}>
            {children}
        </JobWatcherContext.Provider>
    );
};

export default JobWatcherProvider;