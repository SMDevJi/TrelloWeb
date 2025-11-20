import React from 'react';
import { FaSpinner } from 'react-icons/fa';

function Loading() {
  return (
    <div className="loading-container w-full h-[200px] flex justify-center">
      <FaSpinner className="mt-8 w-[50px] h-[50px] animate-spin" />
    </div>
  );
};

export default Loading;
