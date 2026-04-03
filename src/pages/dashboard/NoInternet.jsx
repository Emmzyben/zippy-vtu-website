import React from 'react';
import { FaWifi } from 'react-icons/fa';

const NoInternet = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FaWifi className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No Internet Connection
        </h1>
        <p className="text-gray-600 mb-6">
          It looks like you're offline. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NoInternet;
