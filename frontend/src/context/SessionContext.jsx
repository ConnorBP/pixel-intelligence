import { createContext } from 'react';
// import { useLocalStorage } from '../hooks/useLocalStorage';
import Cookies from 'js-cookie';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    // const [currentSession, setCurrentSession] = useLocalStorage("userSession",null);

    const getCurrentSession = () => {
        const currentToken = Cookies.get('access_token');

        return 
    }

    const refreshSession = () => {
        //todo fetch new session from api endpoint
    };


    return (
        <SessionContext.Provider value={{ getCurrentSession, refresh: refreshSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const { currentSession, refresh } = useContext(SessionContext);



    return { currentSession, refresh };
};

