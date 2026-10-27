import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/inter';
import { AuthProvider } from './auth/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

// The mock API owns its own state, so queries should always read fresh data.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 0, refetchOnWindowFocus: false, retry: false },
  },
});

// On GitHub Pages the app lives under /MediLynk/, so the router needs the same base as the build.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
