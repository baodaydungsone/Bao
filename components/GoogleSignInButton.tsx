
import React from 'react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import Button from './Button'; // Assuming you have a general Button component

const GoogleSignInButton: React.FC = () => {
  const { isSignedIn, userProfile, isLoading, signIn, signOut, isGapiInitialized } = useGoogleAuth();

  if (isLoading && !isGapiInitialized) {
    return (
      <Button variant="outline" size="sm" disabled className="opacity-70">
        <i className="fas fa-spinner fa-spin mr-2"></i>Khởi tạo Google...
      </Button>
    );
  }
  
  if (isLoading) {
     return (
      <Button variant="outline" size="sm" disabled className="opacity-70">
        <i className="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...
      </Button>
    );
  }

  if (isSignedIn && userProfile) {
    return (
      <div className="flex items-center space-x-2">
        {userProfile.picture && (
          <img src={userProfile.picture} alt="User" className="w-8 h-8 rounded-full border-2 border-primary dark:border-primary-light" />
        )}
        <span className="text-sm font-medium text-text-light dark:text-text-dark hidden sm:inline">{userProfile.givenName || userProfile.name}</span>
        <Button onClick={signOut} variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-300 dark:hover:bg-red-500 dark:hover:text-white">
          <i className="fas fa-sign-out-alt mr-1 sm:mr-2"></i><span className="hidden sm:inline">Đăng Xuất</span>
        </Button>
      </div>
    );
  }

  return (
    <Button 
        onClick={signIn} 
        variant="primary" 
        size="sm" 
        disabled={!isGapiInitialized || isLoading}
        className="bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white"
    >
      <i className="fab fa-google mr-2"></i>Đăng Nhập với Google
    </Button>
  );
};

export default GoogleSignInButton;

