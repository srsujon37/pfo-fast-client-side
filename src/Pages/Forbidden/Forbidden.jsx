import React from 'react';

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="text-center max-w-md p-6 bg-white shadow-lg rounded-2xl border border-red-200">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222l-1.414 1.414L10.828 12l-5.192 5.192 1.414 1.414L12 14.828l4.95 4.95 1.414-1.414L13.172 12z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">403 Forbidden</h1>
        <p className="text-gray-600 mb-4">
          আপনি এই পৃষ্ঠায় প্রবেশের অনুমতি পাচ্ছেন না। এটি শুধুমাত্র অনুমোদিত ইউজারদের জন্য।
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
        >
          হোমপেজে ফিরে যান
        </a>
      </div>
    </div>
  );
};

export default Forbidden;
