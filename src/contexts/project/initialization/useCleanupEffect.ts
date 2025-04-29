
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook to handle cleanup when component unmounts
 */
export const useCleanupEffect = (projectChannel: RealtimeChannel | null) => {
  useEffect(() => {
    return () => {
      // Clean up subscription on unmount
      if (projectChannel) {
        try {
          const supabase = require('@/integrations/supabase/client').supabase;
          supabase.removeChannel(projectChannel);
        } catch (err) {
          console.error("Error removing channel on unmount:", err);
        }
      }
    };
  }, [projectChannel]);
};
