import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-8xl font-bold text-neutral-200">404</div>
      <h1 className="text-2xl font-bold mt-4 text-neutral-800">Page Not Found</h1>
      <p className="text-neutral-500 mt-2 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;