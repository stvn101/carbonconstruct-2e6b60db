
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { syncService, syncQueue, SyncAction } from '@/services/offlineCache/offlineCacheService';

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState<SyncAction[]>([]);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Load pending actions on mount
  useEffect(() => {
    loadPendingActions();
  }, []);
  
  const loadPendingActions = useCallback(async () => {
    const actions = await syncQueue.getPendingActions();
    setPendingActions(actions);
  }, []);
  
  // Attempt sync when we go online
  useEffect(() => {
    const handleOnline = () => {
      toast.success("You're back online!", { 
        id: "connection-restored",
        duration: 3000 
      });
      syncNow();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
  
  // Attempt synchronization
  const syncNow = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error("You're currently offline. Changes will sync when you reconnect.", {
        id: "offline-sync-error",
        duration: 5000
      });
      return;
    }
    
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      const result = await syncService.synchronize();
      
      if (result.syncedCount > 0) {
        toast.success(`Synced ${result.syncedCount} pending changes`, {
          id: "sync-success",
          duration: 3000
        });
      }
      
      if (result.failedCount > 0) {
        toast.error(`Failed to sync ${result.failedCount} changes`, {
          id: "sync-partial-failure",
          duration: 5000
        });
      }
      
      setLastSynced(new Date());
      await loadPendingActions();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Synchronization failed. We'll try again later.", {
        id: "sync-error",
        duration: 5000
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, loadPendingActions]);
  
  // Add a new action to the sync queue
  const addSyncAction = useCallback(async (
    type: 'create' | 'update' | 'delete',
    entity: 'project' | 'material' | 'setting',
    data: any
  ) => {
    const action = await syncQueue.addPendingAction({
      type,
      entity,
      data
    });
    
    await loadPendingActions();
    
    // Attempt immediate sync if we're online
    if (navigator.onLine) {
      syncService.scheduleSync();
    }
    
    return action;
  }, [loadPendingActions]);
  
  return {
    isSyncing,
    pendingActions,
    lastSynced,
    syncNow,
    addSyncAction,
    hasPendingChanges: pendingActions.length > 0
  };
}
