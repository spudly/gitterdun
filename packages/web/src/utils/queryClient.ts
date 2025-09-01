import {QueryClient} from '@tanstack/react-query';
import {DEFAULT_GC_TIME, DEFAULT_QUERY_STALE_TIME} from '../constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {staleTime: DEFAULT_QUERY_STALE_TIME, gcTime: DEFAULT_GC_TIME},
  },
});
