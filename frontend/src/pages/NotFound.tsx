import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <h1 className="text-8xl font-extrabold gradient-text">404</h1>
    <p className="mt-4 text-xl font-semibold">Page not found</p>
    <p className="mt-2 text-slate-500">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary mt-6">Back to Home</Link>
  </div>
);

export default NotFound;
