import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GoogleUser } from '../types';
import { GOOGLE_CLIENT_ID, DRIVE_SCOPES } from '../constants';
import { usePublicToast } from './ToastContext';
import { loadDriveApi, getOrCreateAppFolderId as fetchOrCreateAppFolderId } from '../services/GoogleDriveService';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface GoogleAuthContextType {
  googleUser: GoogleUser | null;
  accessToken: string | null;
  isDriveApiReady: boolean;
  driveAppFolderId: string | null;
  signIn: () => void;
  signOut: () => void;
  isLoadingAuth: boolean;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDriveApiReady, setIsDriveApiReady] = useState<boolean>(false);
  const [driveAppFolderId, setDriveAppFolderId] = useState<string | null>(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Initially true

  const { addToast } = usePublicToast();

  const initGapiClient = useCallback(() => {
    window.gapi.load('client', async () => {
      setGapiLoaded(true);
    });
  }, []);
  
  useEffect(() => {
    // Load GAPI script
    const gapiScript = document.getElementById('gapi-script');
    if (!gapiScript) {
      const script = document.createElement('script');
      script.id = 'gapi-script';
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = initGapiClient;
      document.body.appendChild(script);
    } else if (typeof window.gapi !== 'undefined') {
      initGapiClient(); // If script exists, try to init
    }
  }, [initGapiClient]);
  
  useEffect(() => {
    if (!gapiLoaded) return; // Wait for GAPI

    // Load GIS script
    const gisScript = document.getElementById('gis-script');
    if (!gisScript) {
      const script = document.createElement('script');
      script.id = 'gis-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGisLoaded(true);
      };
      document.body.appendChild(script);
    } else if (typeof window.google !== 'undefined' && window.google.accounts) {
       setGisLoaded(true); // If script exists, set as loaded
    }

  }, [gapiLoaded]);


  const initializeDrive = useCallback(async (token: string) => {
    if (!window.gapi?.client) {
      addToast({ message: 'Google API client not loaded.', type: 'error' });
      return;
    }
     window.gapi.client.setToken({ access_token: token });
    try {
      await loadDriveApi();
      setIsDriveApiReady(true);
      addToast({ message: 'Đã kết nối Google Drive.', type: 'success', icon: 'fab fa-google-drive' });
      const folderId = await fetchOrCreateAppFolderId();
      setDriveAppFolderId(folderId);
    } catch (error) {
      console.error('Error initializing Drive API or getting folder:', error);
      addToast({ message: 'Lỗi kết nối Google Drive.', type: 'error' });
      setIsDriveApiReady(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (gisLoaded && gapiLoaded) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: `${DRIVE_SCOPES} https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`,
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setAccessToken(tokenResponse.access_token);
              // Fetch user info
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              })
              .then(response => response.json())
              .then(data => {
                setGoogleUser({
                  id: data.sub,
                  name: data.name,
                  email: data.email,
                  picture: data.picture,
                });
                addToast({ message: `Đã đăng nhập với ${data.name}.`, type: 'success' });
              })
              .catch(error => {
                console.error('Error fetching user info:', error);
                addToast({ message: 'Lỗi lấy thông tin người dùng.', type: 'error'});
              });

              initializeDrive(tokenResponse.access_token);
            } else if (tokenResponse.error) {
                 addToast({ message: `Lỗi ủy quyền Google: ${tokenResponse.error_description || tokenResponse.error}`, type: 'error', duration: 10000 });
                 console.error('Google Auth Error:', tokenResponse);
            }
             setIsLoadingAuth(false);
          },
        });
        setTokenClient(client);
      } catch (error) {
        console.error("Error initializing Google Token Client:", error);
        addToast({message: "Lỗi khởi tạo dịch vụ Google.", type: 'error'});
      } finally {
         setIsLoadingAuth(false); // Done loading auth setup attempts
      }
    }
  }, [gisLoaded, gapiLoaded, addToast, initializeDrive]);

  const signIn = () => {
    if (tokenClient) {
      setIsLoadingAuth(true);
      tokenClient.requestAccessToken();
    } else {
       addToast({message: 'Dịch vụ Google chưa sẵn sàng. Vui lòng thử lại sau giây lát.', type: 'warning'});
       console.warn("Google Token Client not ready for sign in request.")
       // Attempt to re-trigger load if somehow missed
       if (!gapiLoaded) initGapiClient();
       else if (!gisLoaded && gapiLoaded) {
          const gisScript = document.getElementById('gis-script');
          if (gisScript) gisScript.onload?.(new Event('load')); // Manually trigger onload if script exists
       }
       setIsLoadingAuth(false);
    }
  };

  const signOut = () => {
    if (accessToken) {
      window.google?.accounts?.oauth2?.revoke(accessToken, () => {
        setAccessToken(null);
        setGoogleUser(null);
        setIsDriveApiReady(false);
        setDriveAppFolderId(null);
        addToast({ message: 'Đã đăng xuất khỏi Google.', type: 'info' });
      });
    } else {
        setAccessToken(null);
        setGoogleUser(null);
        setIsDriveApiReady(false);
        setDriveAppFolderId(null);
    }
    if (window.gapi && window.gapi.client) {
      window.gapi.client.setToken(null);
    }
    setIsLoadingAuth(false);
  };

  return (
    <GoogleAuthContext.Provider value={{ googleUser, accessToken, isDriveApiReady, driveAppFolderId, signIn, signOut, isLoadingAuth }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
};
