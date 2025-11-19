interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  type = 'error',
}) => {
  const colors = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
      button: 'text-red-600 hover:text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
      button: 'text-yellow-600 hover:text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      button: 'text-blue-600 hover:text-blue-800',
    },
  };

  const colorScheme = colors[type];

  return (
    <div
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg p-4 my-4`}
      role="alert"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start">
          <svg
            className={`h-5 w-5 ${colorScheme.icon} mr-2 flex-shrink-0 mt-0.5`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {type === 'error' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : type === 'warning' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          <p className={`${colorScheme.text} text-sm sm:text-base`}>{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`${colorScheme.button} font-medium text-sm px-4 py-2 border ${colorScheme.border} rounded-md hover:bg-white transition-colors whitespace-nowrap`}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

