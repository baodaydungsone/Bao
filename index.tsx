
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { InternalToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext'; // Corrected import

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <InternalToastProvider>
        <AuthProvider> {/* Wrap App with AuthProvider */}
          <App />
        </AuthProvider>
      </InternalToastProvider>
    </SettingsProvider>
  </React.StrictMode>
);