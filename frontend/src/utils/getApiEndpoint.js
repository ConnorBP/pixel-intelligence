// gets the server endpoint based on the environment set by vite
export default () => {
    if(import.meta.env.MODE === 'development') {
        return 'http://localhost:3000/api';
    } else {
        // in production all api requests are on /api route on same port
        return '/api';
    }
};