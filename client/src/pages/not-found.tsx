import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen text-white bg-gray-900">
            <div className="text-center">
                <h1 className="font-bold text-purple-500 text-9xl">404</h1>
                <p className="mt-4 text-2xl font-semibold">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <p className="mt-2 text-gray-400">
                    It looks like you may have taken a wrong turn. Don't worry, it happens to the best of us.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 mt-8 text-lg font-medium text-white bg-purple-500 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Go Back Home
                </Link>
            </div>
            <div className="mt-12 text-gray-600">
                <p>© 2024 Eat360. All rights reserved.</p>
            </div>
        </div>
    );
}

export default NotFoundPage;
