import { createContext, useState, useContext, useEffect } from 'react';
import { getApiEndpoint } from '../utils';
// import { useLocalStorage } from '../hooks/useLocalStorage';
// import Cookies from 'js-cookie';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    // const [currentSession, setCurrentSession] = useLocalStorage("userSession",null);
    const [sessionLoaded, setSessionLoaded] = useState(false);

    // the time in NumericDate format at which the session will expire in utc seconds since epoch (Jan 1, 1970)
    // NumericDate: A JSON numeric value representing the number of seconds from 1970-01-01T00:00:00Z UTC
    // until the specified UTC date/time, ignoring leap seconds.
    const [sessionExpiry, setSessionExpiry] = useState(0);

    // const getCurrentSession = () => {
    //     // const currentToken = Cookies.get('access_token');

    //     return
    // }

    const refreshSession = () => {
        setSessionLoaded(false);

        const endpoint = getApiEndpoint() + '/auth';
        // console.log(endpoint);
        fetch(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch session');
                }
                return response.json();
            })
            .then(data => {
                setSessionExpiry(data.expiresAt);
                setSessionLoaded(true);
            })
            .catch(error => {
                console.error('Error fetching session:', error);
                setSessionLoaded(false);
            });
    };

    // refresh session once on load if unset
    useEffect(() => {
        if (!sessionLoaded) {
            refreshSession();
        }
    }, []);

    // check if the session is expired yet based on our saved expiryTime
    function isSessionStillValid() {
        // if the session is expired
        if (sessionExpiry < Math.floor(Date.now() / 1000)) {
            // clear the session
            // setCurrentSession(null);
            setSessionLoaded(false);

            return false;
        }
        return true;
    }

    return (
        <SessionContext.Provider value={{
            sessionLoaded,
            sessionExpiry,
            refresh: refreshSession,
            isSessionStillValid: isSessionStillValid
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export function useSession() {
    const { sessionLoaded, sessionExpiry, refresh, isSessionStillValid } = useContext(SessionContext);

    return { sessionLoaded, sessionExpiry, refresh, isSessionStillValid };
};

