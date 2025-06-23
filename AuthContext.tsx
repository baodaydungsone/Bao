import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GoogleUserProfile, DriveAppContext } from '../types';
import { GOOGLE_CLIENT_ID, DRIVE_SCOPES } from '../constants';
import * as GoogleDriveService from '../services/GoogleDriveService';

// Type declarations for gapi and google on Window
// This allows TypeScript to recognize gapi and google properties on the window object.
declare global {
  interface Window {
    gapi: any; // Google API client (for Drive)
    google: any; // Google Identity Services (for Sign-In)
  }
}

interface AuthContextType {
  isGoogleLoggedIn: boolean;
  googleUser: GoogleUserProfile | null;
  signInGoogle: () => void;
  signOutGoogle: () => void;
  isLoadingAuth: boolean;
  accessToken: string | null;
  isGapiLoaded: boolean;
  isGisLoaded: boolean;
  requestDriveScopes: () => Promise<void>;
  driveContext: DriveAppContext;
  setDriveContext: React.Dispatch<React.SetStateAction<DriveAppContext>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);
  const [driveContext, setDriveContext] = useState<DriveAppContext>({ appFolderId: null });
  const [tokenClient, setTokenClient] = useState<any>(null);

  const GIS_SCRIPT_ID = 'gis-script';
  const GAPI_SCRIPT_ID = 'gapi-script';

  const handleCredentialResponse = useCallback(async (response: any) => {
    if (response.credential) {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedCredential = JSON.parse(jsonPayload);

        setGoogleUser({
          id: decodedCredential.sub,
          name: decodedCredential.name,
          email: decodedCredential.email,
          picture: decodedCredential.picture,
        });
        setIsGoogleLoggedIn(true);
        // Request Drive scopes immediately after sign-in
        if (tokenClient) {
          tokenClient.requestAccessToken({ prompt: '' }); // Empty prompt for potentially silent consent if already granted
        }
      } catch (error) {
        console.error('Error decoding credential or processing sign-in:', error);
        setIsGoogleLoggedIn(false);
        setGoogleUser(null);
        setAccessToken(null);
      }
    } else {
      console.error('Google Sign-In error: No credential in response.');
    }
  }, [tokenClient]);

  // Initialize GIS and Token Client
  useEffect(() => {
    if (document.getElementById(GIS_SCRIPT_ID)) {
      if (window.google && window.google.accounts) setIsGisLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGisLoaded(true);
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
      }
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: DRIVE_SCOPES,
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setAccessToken(tokenResponse.access_token);
            } else if (tokenResponse && tokenResponse.error) {
                console.warn('Google Auth: Access token denied or error.', tokenResponse.error);
                // Handle cases like 'user_declined_consent' or 'immediate_failed'
                // Potentially clear access token if it was previously set
                setAccessToken(null);
            } else {
              console.error('Token response error or missing access_token:', tokenResponse);
            }
          },
        });
        setTokenClient(client);
      }
    };
    script.onerror = () => console.error('GIS script failed to load.');
    document.body.appendChild(script);
  }, [handleCredentialResponse]);

  // Load GAPI
  useEffect(() => {
    if (document.getElementById(GAPI_SCRIPT_ID)) {
       if (window.gapi && window.gapi.client) setIsGapiLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = GAPI_SCRIPT_ID;
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load('client', () => {
        setIsGapiLoaded(true);
      });
    };
    script.onerror = () => console.error('GAPI script failed to load.');
    document.body.appendChild(script);
  }, []);

  const signInGoogle = useCallback(() => {
    if (!isGisLoaded || !window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Identity Services not loaded yet for sign-in button.');
      return;
    }
    // Primarily trigger the token client for scopes, GIS ID prompt can be used for initial login
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Fallback or initial sign-in prompt if tokenClient isn't ready or this is the first interaction
         window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                console.log('Google One Tap prompt was not displayed or skipped.');
                // Here you might want to manually render a sign-in button if One Tap fails
            }
        });
    }
  }, [isGisLoaded, tokenClient]);

  const signOutGoogle = useCallback(() => {
    setIsGoogleLoggedIn(false);
    setGoogleUser(null);
    if (accessToken && window.google && window.google.accounts && window.google.accounts.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        setAccessToken(null);
      });
    } else {
        setAccessToken(null);
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    GoogleDriveService.resetDriveCache();
    setDriveContext({ appFolderId: null });
  }, [accessToken]);

  const requestDriveScopes = useCallback(async () => {
    if (!tokenClient) {
      console.error("Token client not initialized for requesting Drive scopes.");
      return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [tokenClient]);

  useEffect(() => {
    if (isGisLoaded && isGapiLoaded) {
      setIsLoadingAuth(false);
    } else {
      setIsLoadingAuth(true);
    }
  }, [isGisLoaded, isGapiLoaded]);

  const contextValue: AuthContextType = {
    isGoogleLoggedIn,
    googleUser,
    signInGoogle,
    signOutGoogle,
    isLoadingAuth,
    accessToken,
    isGapiLoaded,
    isGisLoaded,
    requestDriveScopes,
    driveContext,
    setDriveContext
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
