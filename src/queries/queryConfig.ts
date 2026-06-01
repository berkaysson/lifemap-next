/**
 * React Query caching and refetching strategies.
 * Provides granular control over different data categories.
 */

// Cache duration helper constants (in milliseconds)
export const MINUTE = 1000 * 60;

export const CACHE_STRATEGIES = {
  /**
   * Static/Infrequently changing data (e.g. Categories, Projects)
   * High staleTime and gcTime to maximize local caching.
   */
  STATIC: {
    staleTime: 10 * MINUTE,       // 10 minutes
    gcTime: 30 * MINUTE,          // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * Regular/Moderate changing data (e.g. Habits, Notes, Progress, Tasks)
   * Balanced caching to ensure fresh updates without excessive requests.
   */
  REGULAR: {
    staleTime: 5 * MINUTE,        // 5 minutes
    gcTime: 15 * MINUTE,          // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * Critical/Frequently changing data (e.g. Activities, Todos)
   * Low staleTime for real-time freshness, but avoids instant refetches.
   */
  CRITICAL: {
    staleTime: 2 * MINUTE,        // 2 minutes
    gcTime: 10 * MINUTE,          // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
} as const;
