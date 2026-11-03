// Realtime cross-tab, cross-window, and reactive synchronization engine
let channel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel('mmps_realtime_sync');
  }
} catch (e) {
  console.warn('BroadcastChannel initialization fallback:', e);
}

/**
 * Broadcast an update across all open tabs, windows, and components
 * @param {'announcements' | 'jobs' | 'gallery' | 'messages' | 'students' | 'fees' | 'attendance'} entity
 * @param {any} data
 */
export const broadcastUpdate = (entity, data = null) => {
  const payload = {
    entity,
    data,
    timestamp: Date.now(),
  };

  // 1. Cross-tab BroadcastChannel (<1ms)
  if (channel) {
    try {
      channel.postMessage(payload);
    } catch (e) {
      console.warn('BroadcastChannel postMessage error:', e);
    }
  }

  // 2. Storage event trigger for other tabs
  try {
    localStorage.setItem('mmps_realtime_ping', JSON.stringify(payload));
  } catch {
    // Non-fatal
  }

  // 3. Local window custom event for current tab components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(`mmps_${entity}_updated`, { detail: payload }));
    window.dispatchEvent(new CustomEvent('mmps_realtime_event', { detail: payload }));
  }
};

/**
 * Subscribe to real-time updates for an entity with automatic tab-switching sync
 * @param {string} entity 'announcements', 'jobs', 'gallery', 'messages', or 'all'
 * @param {Function} callback Callback receiving the updated payload
 * @returns {Function} Unsubscribe cleanup function
 */
export const subscribeToUpdates = (entity, callback) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleBroadcast = (evt) => {
    if (!entity || entity === 'all' || evt.data?.entity === entity) {
      callback(evt.data);
    }
  };

  const handleCustomEvent = (evt) => {
    callback(evt.detail);
  };

  const handleStorage = (evt) => {
    if (evt.key === 'mmps_realtime_ping' && evt.newValue) {
      try {
        const parsed = JSON.parse(evt.newValue);
        if (!entity || entity === 'all' || parsed.entity === entity) {
          callback(parsed);
        }
      } catch {
        // Non-fatal
      }
    }
  };

  // Instant refresh when user switches tabs back to this page
  const handleVisibilityOrFocus = () => {
    if (document.visibilityState === 'visible') {
      callback({ entity, isFocusTrigger: true, timestamp: Date.now() });
    }
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener(`mmps_${entity}_updated`, handleCustomEvent);
  window.addEventListener('storage', handleStorage);
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);
  window.addEventListener('focus', handleVisibilityOrFocus);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener(`mmps_${entity}_updated`, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    window.removeEventListener('focus', handleVisibilityOrFocus);
  };
};

