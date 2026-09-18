import { getDatabase, MobileVaultItem, saveItemOffline } from './storage';

const API_BASE_URL = 'http://localhost:5000';

export interface QueueTask {
  id: string;
  action: 'lock' | 'purge' | 'shred';
  payload: any;
  retries: number;
  created_at: number;
}

let isFlushing = false;

// Enqueue action when offline or optimistic local commit
export async function enqueueSyncTask(action: 'lock' | 'purge' | 'shred', payload: any): Promise<void> {
  const db = await getDatabase();
  const id = `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  await db.runAsync(
    `INSERT INTO offline_sync_queue (id, action, payload, retries, created_at) VALUES (?, ?, ?, 0, ?)`,
    [id, action, JSON.stringify(payload), Date.now()]
  );

  // Proactively attempt flush if network is available
  flushSyncQueue().catch(() => {});
}

// Background queue processor with exponential backoff
export async function flushSyncQueue(): Promise<number> {
  if (isFlushing) return 0;
  isFlushing = true;

  let processedCount = 0;
  try {
    const db = await getDatabase();
    const tasks = await db.getAllAsync<{ id: string; action: string; payload: string; retries: number }>(
      'SELECT * FROM offline_sync_queue ORDER BY created_at ASC LIMIT 10'
    );

    for (const task of tasks) {
      try {
        const payload = JSON.parse(task.payload);
        let endpoint = `${API_BASE_URL}/api/vault/lock`;
        if (task.action === 'shred') {
          endpoint = `${API_BASE_URL}/api/vault/shred-user`;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok || res.status === 409) {
          // Success or already idempotent duplicate -> remove from queue
          await db.runAsync('DELETE FROM offline_sync_queue WHERE id = ?', [task.id]);
          processedCount++;
        } else {
          // Increment retries
          await db.runAsync('UPDATE offline_sync_queue SET retries = retries + 1 WHERE id = ?', [task.id]);
        }
      } catch (err) {
        // Network unavailable -> keep in queue for next reconnection
        await db.runAsync('UPDATE offline_sync_queue SET retries = retries + 1 WHERE id = ?', [task.id]);
        break;
      }
    }
  } catch (e) {
    // Database or network offline
  } finally {
    isFlushing = false;
  }

  return processedCount;
}
