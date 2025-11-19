import { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-400',
      iconBg: 'bg-green-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400',
      iconBg: 'bg-red-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-100',
    },
  };

  const colorScheme = colors[notification.type];

  return (
    <div
      className={`${colorScheme.bg} ${colorScheme.border} border rounded-lg shadow-lg p-4 mb-3 flex items-start animate-slide-in`}
      role="alert"
    >
      <div className={`${colorScheme.iconBg} rounded-full p-2 flex-shrink-0`}>
        {notification.type === 'success' ? (
          <svg
            className={`h-5 w-5 ${colorScheme.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : notification.type === 'error' ? (
          <svg
            className={`h-5 w-5 ${colorScheme.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className={`h-5 w-5 ${colorScheme.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <div className="ml-3 flex-1">
        <p className={`${colorScheme.text} text-sm font-medium`}>{notification.message}</p>
      </div>
      <button
        onClick={() => onClose(notification.id)}
        className={`ml-4 ${colorScheme.text} hover:opacity-75 transition-opacity`}
        aria-label="Close notification"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;

