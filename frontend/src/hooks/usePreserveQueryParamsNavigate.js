// https://stackoverflow.com/questions/74728598/how-to-preserve-query-params-using-route-in-react-router-v6
import { useLocation, useNavigate } from 'react-router-dom';

export const usePreserveQueryParamsNavigate = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    return (path) => {
        navigate(path + search);
    };
};