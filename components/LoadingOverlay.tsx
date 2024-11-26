// @components/LoadingOverlay.tsx

import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import a loading icon

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-4xl mb-4" />
        {message && <p className="text-white text-lg">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingOverlay;
