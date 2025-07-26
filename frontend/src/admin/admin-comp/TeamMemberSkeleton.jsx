import React from "react";

export default function TeamMemberSkeleton() {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-900 rounded-2xl p-4 sm:p-8 text-center min-h-[120px] sm:min-h-[220px] flex flex-col items-center">
      <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-16 sm:w-24 h-16 sm:h-24 mb-4" />
      <div className="h-3 sm:h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 sm:h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
      <div className="h-3 sm:h-4 w-4/5 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
      <div className="flex gap-2 sm:gap-4 justify-center w-1/3">
        <div className="h-5 sm:h-6 w-5 sm:w-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="h-5 sm:h-6 w-5 sm:w-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="h-5 sm:h-6 w-5 sm:w-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}