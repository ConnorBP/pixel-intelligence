import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import checkGenerationStatus from '../api/checkGeneration';

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

export const JobWatcherProvider = ({ children }) => {

    const [state, dispatch] = useReducer(jobWatcherReducer, getStorageValue('currentJobStatus', {
        currentJobId: null,
        currentJobStatus: 'idle',
        currentJobSubmittedAt: null,
        currentJobEta: null,
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
                    dispatch({ type: 'complete', result: response.result });
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
            const interval = setInterval(() => {
                pollJobStatus(state.currentJobId);
            }, 5000);

            return () => clearInterval(interval);
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