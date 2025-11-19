import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Notification, { NotificationType } from './Notification';

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: NotificationType }>
  >([]);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-20 right-2 sm:right-4 z-50 w-full max-w-sm px-2 sm:px-0 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

