import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="mb-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">404</h1>
            <p className="mb-4 block text-sm/6 font-medium text-gray-900">Oops! Page not found.</p>
            <Link
                to="/"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
