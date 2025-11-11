const ErrorMessage = ({ onRetry }) => {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center text-center">
      <p className="text-red-600 font-medium mb-3">Failed to load the tree.</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorMessage;
