import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

/** 개발환경에서만 msw ON */
// if (process.env.NODE_ENV === 'development') {
//   await worker.start({
//     onUnhandledRequest: 'bypass',
//   });
// }

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="455387223609-2ptall2ouehp7kd1uskrrroi8ft9o39t.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </QueryClientProvider>,
);
