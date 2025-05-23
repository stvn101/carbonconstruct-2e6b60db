
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, XCircle } from 'lucide-react';
import { useOfflineState } from '@/hooks/use-offline-state';
import { formatDistanceToNow } from 'date-fns';

export const OfflineStatusIndicator: React.FC = () => {
  const { isOffline, lastOnlineTime, getOfflineDuration, checkConnection } = useOfflineState();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      setDismissed(false);
    } else {
      // When coming back online, briefly show the online message then hide
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);
  
  if (!visible || dismissed) return null;
  
  return (
    <div 
      className={`fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:w-80 p-4 rounded-lg shadow-lg z-50 flex items-center justify-between ${
        isOffline ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100' : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        {isOffline ? (
          <WifiOff className="h-5 w-5" />
        ) : (
          <Wifi className="h-5 w-5" />
        )}
        <div>
          <p className="font-medium">
            {isOffline ? 'You are offline' : 'Back online'}
          </p>
          {isOffline && lastOnlineTime && (
            <p className="text-xs mt-1">
              Last online {formatDistanceToNow(lastOnlineTime, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {isOffline && (
          <button 
            onClick={() => checkConnection()}
            className="text-xs px-2 py-1 bg-amber-200 dark:bg-amber-800 rounded hover:bg-amber-300 dark:hover:bg-amber-700"
          >
            Retry
          </button>
        )}
        <button 
          onClick={() => setDismissed(true)} 
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
