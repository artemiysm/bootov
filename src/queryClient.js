import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.response?.status === 404) return false; // не повторять 404
        return failureCount < 2;
      },
      onError: (error) => {
        console.error('Query failed:', error);
        // можно вызвать toast или Sentry
      },
    },
  },
});


export default queryClient;