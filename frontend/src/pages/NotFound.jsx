import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>Page Not Found</h1>
            <p><Link to={{ pathname: "/" }}>Return to the home page</Link></p>
        </div>
    )
}

export default NotFound