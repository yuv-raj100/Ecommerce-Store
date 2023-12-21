import React, { useState } from 'react';

const SlidingDiv = () => {
  const [showDiv, setShowDiv] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <div>
        <button onClick={() => setShowDiv(!showDiv)} className="mt-4 p-2 bg-blue-500 text-white">
          Show Sliding Div
        </button>
      </div>

      {/* Sliding div */}
      {showDiv && (
        <div className="fixed top-0 left-0 h-full w-4/5 bg-white shadow-lg z-50 transition-transform transform">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Sliding Div Content</h2>
            <p>This is the content of the sliding div.</p>
            <button onClick={() => setShowDiv(false)} className="mt-4 p-2 bg-red-500 text-white">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidingDiv;