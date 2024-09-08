import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { worker } from './mocks/browser';

const queryClient = new QueryClient();

/** 개발환경에서만 msw ON */
if (process.env.NODE_ENV === 'development') {
  worker.start();
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
