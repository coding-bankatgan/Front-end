import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { worker } from './mocks/browser.ts';

const queryClient = new QueryClient();

// await worker.start({
//   onUnhandledRequest: 'bypass',
// });

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
