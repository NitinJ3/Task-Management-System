import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        
        <h1 className="text-8xl font-extrabold text-indigo-600">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;