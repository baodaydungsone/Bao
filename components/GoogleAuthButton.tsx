import React from 'react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import Button from './Button'; // Assuming you have a general Button component

const GoogleAuthButton: React.FC<{variant?: 'button' | 'dropdownItem'}> = ({variant = 'button'}) => {
  const { googleUser, signIn, signOut, isLoadingAuth } = useGoogleAuth();

  if (isLoadingAuth && variant === 'button') {
    return (
      <Button size="xs" variant="ghost" disabled className="animate-pulse">
        <i className="fab fa-google mr-2"></i> Đang tải...
      </Button>
    );
  }
  if (isLoadingAuth && variant === 'dropdownItem') {
    return (
      <div className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200 opacity-50">
        <i className="fab fa-google mr-2"></i> Đang tải...
      </div>
    );
  }


  if (googleUser) {
    if (variant === 'dropdownItem') {
       return (
        <>
          <div className="px-4 py-2 text-xs text-slate-700 dark:text-slate-200">
            Đăng nhập với:
            <div className="flex items-center mt-1">
              {googleUser.picture && (
                <img src={googleUser.picture} alt="Ảnh đại diện" className="w-5 h-5 rounded-full mr-2" />
              )}
              <span className="font-medium truncate" title={googleUser.name || googleUser.email}>{googleUser.name || googleUser.email}</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-2.5 w-4 text-center"></i>Đăng Xuất Google
          </button>
        </>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        {googleUser.picture && (
          <img src={googleUser.picture} alt={googleUser.name || 'User'} className="w-7 h-7 rounded-full shadow" />
        )}
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline truncate max-w-[100px]" title={googleUser.name || googleUser.email}>
          {googleUser.name || googleUser.email}
        </span>
        <Button onClick={signOut} size="xs" variant="danger" title="Đăng xuất Google">
          <i className="fas fa-sign-out-alt"></i>
          <span className="hidden sm:inline ml-1">Đăng Xuất</span>
        </Button>
      </div>
    );
  }

  // Not signed in
   if (variant === 'dropdownItem') {
    return (
      <button
        onClick={signIn}
        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center"
      >
        <i className="fab fa-google mr-2.5 w-4 text-center text-blue-500"></i>Kết Nối Google Drive
      </button>
    );
  }

  return (
    <Button onClick={signIn} size="xs" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-500 dark:hover:text-white">
      <i className="fab fa-google mr-1.5"></i>
      <span className="hidden sm:inline">Kết Nối Google Drive</span>
      <span className="sm:hidden">Drive</span>
    </Button>
  );
};

export default GoogleAuthButton;
