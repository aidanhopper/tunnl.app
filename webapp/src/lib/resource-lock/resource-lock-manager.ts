interface LockInfo {
  promise: Promise<void>;
  resolve: () => void;
  timestamp: number;
  timeout?: NodeJS.Timeout;
}

class ResourceLockManager {
  private locks = new Map<string, LockInfo>();
  private readonly defaultTimeoutMs: number;

  constructor(defaultTimeoutMs: number = 30000) { // 30 second default timeout
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  /**
   * Acquire a lock for a resource. If the resource is already locked,
   * this will wait until the lock is released or timeout occurs.
   */
  async acquireLock(resourceId: string, timeoutMs?: number): Promise<() => void> {
    const timeout = timeoutMs ?? this.defaultTimeoutMs;
    
    // Wait for any existing lock to be released
    while (this.locks.has(resourceId)) {
      await this.locks.get(resourceId)!.promise;
    }

    // Create a new lock
    let resolve: () => void;
    const promise = new Promise<void>((res) => {
      resolve = res;
    });

    const lockInfo: LockInfo = {
      promise,
      resolve: resolve!,
      timestamp: Date.now(),
    };

    // Set up timeout
    if (timeout > 0) {
      lockInfo.timeout = setTimeout(() => {
        this.forceReleaseLock(resourceId);
        console.warn(`Lock for resource ${resourceId} was forcibly released due to timeout`);
      }, timeout);
    }

    this.locks.set(resourceId, lockInfo);

    // Return release function
    return () => this.releaseLock(resourceId);
  }

  /**
   * Release a lock for a resource
   */
  private releaseLock(resourceId: string): void {
    const lockInfo = this.locks.get(resourceId);
    if (lockInfo) {
      if (lockInfo.timeout) {
        clearTimeout(lockInfo.timeout);
      }
      lockInfo.resolve();
      this.locks.delete(resourceId);
    }
  }

  /**
   * Force release a lock (used for timeout scenarios)
   */
  private forceReleaseLock(resourceId: string): void {
    this.releaseLock(resourceId);
  }

  /**
   * Check if a resource is currently locked
   */
  isLocked(resourceId: string): boolean {
    return this.locks.has(resourceId);
  }

  /**
   * Get information about a lock (for debugging)
   */
  getLockInfo(resourceId: string): { timestamp: number; age: number } | null {
    const lockInfo = this.locks.get(resourceId);
    if (!lockInfo) return null;
    
    return {
      timestamp: lockInfo.timestamp,
      age: Date.now() - lockInfo.timestamp
    };
  }

  /**
   * Get all currently locked resource IDs
   */
  getLockedResources(): string[] {
    return Array.from(this.locks.keys());
  }

  /**
   * Execute a function with automatic lock acquisition and release
   */
  async withLock<T>(
    resourceId: string,
    fn: () => Promise<T>,
    timeoutMs?: number
  ): Promise<T> {
    const releaseLock = await this.acquireLock(resourceId, timeoutMs);
    try {
      return await fn();
    } finally {
      releaseLock();
    }
  }
}

// Create a global singleton instance
const globalLockManager = new ResourceLockManager();

export { ResourceLockManager, globalLockManager };

// Usage examples:

// Example 1: Manual lock management
/*
async function updateResource(resourceId: string, data: any) {
  const releaseLock = await globalLockManager.acquireLock(resourceId);
  try {
    // Your API call here
    const result = await externalApiCall(resourceId, data);
    return result;
  } finally {
    releaseLock();
  }
}
*/

// Example 2: Automatic lock management with withLock
/*
async function updateResourceAutomatic(resourceId: string, data: any) {
  return await globalLockManager.withLock(resourceId, async () => {
    // Your API call here
    const result = await externalApiCall(resourceId, data);
    return result;
  });
}
*/

// Example 3: Next.js API route usage
/*
// pages/api/resource/[id].ts or app/api/resource/[id]/route.ts
import { globalLockManager } from '../../../utils/resourceLockManager';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const resourceId = params.id;
  const data = await request.json();

  try {
    const result = await globalLockManager.withLock(resourceId, async () => {
      // Your external API call
      const response = await fetch(`https://external-api.com/resources/${resourceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    }, 10000); // 10 second timeout

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Failed to update resource' }, { status: 500 });
  }
}
*/
