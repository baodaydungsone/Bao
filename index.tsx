import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { InternalToastProvider } from './contexts/ToastContext'; // Changed to InternalToastProvider
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <InternalToastProvider>
        <GoogleAuthProvider>
          <App />
        </GoogleAuthProvider>
      </InternalToastProvider>
    </SettingsProvider>
  </React.StrictMode>
);