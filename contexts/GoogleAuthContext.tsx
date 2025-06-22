
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GoogleUserProfile, GoogleTokenResponse, GameState } from '../types';
import {
  initGoogleClient,
  requestAccessToken,
  fetchUserProfile,
  signOutGoogle,
  uploadGameToDrive,
  isGapiLoaded as checkGapiLoaded,
  isGisLoaded as checkGisLoaded
} from '../services/GoogleDriveService';
import { usePublicToast } from './ToastContext';

interface GoogleAuthContextProps {
  isSignedIn: boolean;
  userProfile: GoogleUserProfile | null;
  isLoading: boolean;
  isGapiInitialized: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  saveGameToDrive: (gameState: GameState, fileName: string) => Promise<void>;
}

const GoogleAuthContext = createContext<GoogleAuthContextProps | undefined>(undefined);

export const GoogleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<GoogleUserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGapiInitialized, setIsGapiInitialized] = useState(false);
  const { addToast } = usePublicToast();

  const initialize = useCallback(async () => {
    setIsLoading(true);
    try {
      await initGoogleClient();
      setIsGapiInitialized(true);
      // Check if user was previously signed in (e.g. gapi.auth2 might have this functionality - simplified here)
      // For GIS, there isn't an explicit "check if signed in". Tokens are shorter-lived.
      // We'll rely on explicit sign-in.
    } catch (error) {
      console.error("Failed to initialize Google Auth:", error);
      addToast({ message: "Không thể khởi tạo dịch vụ Google.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signIn = async () => {
    if (!checkGapiLoaded() || !checkGisLoaded()) {
      addToast({ message: "Thư viện Google chưa sẵn sàng. Vui lòng thử lại sau giây lát.", type: 'warning' });
      await initialize(); // Try to re-initialize
      if(!checkGapiLoaded() || !checkGisLoaded()){
        addToast({ message: "Không thể kết nối với Google. Vui lòng kiểm tra kết nối mạng và thử lại.", type: 'error' });
        return;
      }
    }
    setIsLoading(true);
    try {
      const tokenResponse = await requestAccessToken();
      setAccessToken(tokenResponse.access_token);
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setIsSignedIn(true);
      addToast({ message: `Đăng nhập thành công với tài khoản ${profile?.name || 'Google'}.`, type: 'success' });
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      addToast({ message: `Đăng nhập Google thất bại: ${error.message || 'Lỗi không xác định.'}`, type: 'error' });
      setIsSignedIn(false);
      setUserProfile(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    signOutGoogle();
    setIsSignedIn(false);
    setUserProfile(null);
    setAccessToken(null);
    addToast({ message: "Đã đăng xuất khỏi tài khoản Google.", type: 'info' });
  };
  
  const saveGameToDrive = async (gameState: GameState, fileName: string) => {
    if (!isSignedIn || !accessToken) {
      addToast({ message: "Bạn cần đăng nhập Google để lưu vào Drive.", type: 'warning' });
      // Optionally, trigger signIn here or let the UI handle it
      // await signIn(); // This might be too aggressive
      return;
    }
    if (!checkGapiLoaded() || !checkGisLoaded() || !isGapiInitialized) {
         addToast({ message: "Dịch vụ Google Drive chưa sẵn sàng.", type: 'error' });
         return;
    }

    addToast({ message: `Đang tải lên "${fileName}" lên Google Drive...`, type: 'info', icon: 'fas fa-cloud-upload-alt fa-spin' });
    try {
      const result = await uploadGameToDrive(gameState, fileName);
      if (result) {
        addToast({ message: `"${result.name}" đã được lưu thành công vào Google Drive!`, type: 'success', icon: 'fas fa-check-circle' });
      } else {
        throw new Error("Không nhận được phản hồi từ Drive.");
      }
    } catch (error: any) {
      console.error('Error saving game to Drive:', error);
      addToast({ message: `Lưu vào Drive thất bại: ${error.message || 'Lỗi không xác định.'}`, type: 'error', duration: 10000 });
       if (error.result && error.result.error && error.result.error.message.includes("insufficientPermissions")) {
         addToast({ message: "Ứng dụng không có đủ quyền để truy cập Google Drive. Vui lòng thử đăng nhập lại và cấp quyền.", type: 'error', duration: 10000 });
       }
    }
  };


  return (
    <GoogleAuthContext.Provider value={{ isSignedIn, userProfile, isLoading, isGapiInitialized, signIn, signOut, saveGameToDrive }}>
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

