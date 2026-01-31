import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Time in milliseconds that inactive queries will remain in cache
      gcTime: 1000 * 60 * 10, // 10 minutes
      
      // Retry failed requests 3 times
      retry: 3,
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
})

// Plugin for Vue
export const VueQueryVuePlugin = VueQueryPlugin

// For SSR hydration (if needed later)
export { hydrate, dehydrate }
