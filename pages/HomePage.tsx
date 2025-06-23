
import React, { useEffect, useRef } from 'react';
import { ModalType, GoogleUserProfile } from '../types';
import { APP_TITLE } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext'; // Corrected import
import Button from '../components/Button'; // Assuming Button component is generic enough

interface HomePageProps {
  openModal: (modalType: ModalType) => void;
}

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 10 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
      container.appendChild(particle);
    }
     return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="particle-background" aria-hidden="true"></div>;
};


const HomePage: React.FC<HomePageProps> = ({ openModal }) => {
  const { settings } = useSettings();
  const { isGoogleLoggedIn, googleUser, signInGoogle, signOutGoogle, isLoadingAuth, isGisLoaded, isGapiLoaded } = useAuth();
  const nsfwSettings = useSettings().nsfwSettings;
  const nsfwEnabled = nsfwSettings.enabled;

  const getButtonBaseStyle = (isLarge: boolean = false) => 
    `w-full text-white 
     ${isLarge ? 'text-lg sm:text-xl py-4 sm:py-5' : 'text-base sm:text-lg py-3 sm:py-3.5'} 
     font-semibold flex items-center justify-center 
     transform transition-all duration-300 ease-in-out 
     hover:shadow-xl hover:-translate-y-0.5 
     focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-60 
     button-shimmer rounded-xl shadow-lg`;

  const buttonConfigs = [
    {
      label: "Bắt Đầu Khởi Tạo Mới",
      modal: ModalType.NewStorySetup,
      icon: "fas fa-wand-magic-sparkles",
      gradient: "bg-gradient-to-br from-primary via-emerald-400 to-green-400 dark:from-primary-dark dark:via-emerald-600 dark:to-green-600",
      ring: "focus-visible:ring-primary",
      isLarge: true,
      shimmerDelay: '0s'
    },
    {
      label: "Tải Truyện Đã Lưu",
      modal: ModalType.LoadStory,
      icon: "fas fa-upload",
      gradient: "bg-gradient-to-br from-secondary via-sky-400 to-blue-400 dark:from-secondary-dark dark:via-sky-600 dark:to-blue-600",
      ring: "focus-visible:ring-secondary",
      shimmerDelay: '0.15s'
    },
    {
      label: "Hướng Dẫn Chi Tiết",
      modal: ModalType.Guide,
      icon: "fas fa-book-reader",
      gradient: "bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 dark:from-indigo-600 dark:via-purple-600 dark:to-fuchsia-600",
      ring: "focus-visible:ring-indigo-400",
      shimmerDelay: '0.3s'
    },
    {
      label: "Thiết Lập API Key",
      modal: ModalType.APISettings,
      icon: "fas fa-key",
      gradient: "bg-gradient-to-br from-teal-500 via-cyan-500 to-sky-500 dark:from-teal-600 dark:via-cyan-600 dark:to-sky-600",
      ring: "focus-visible:ring-teal-400",
      shimmerDelay: '0.45s'
    },
    {
      label: `Chế Độ NSFW ${nsfwEnabled ? "(Đang Bật)" : "(Đang Tắt)"}`,
      modal: ModalType.NSFWSettings,
      icon: `fas ${nsfwEnabled ? 'fa-fire-alt' : 'fa-shield-virus'}`,
      gradient: nsfwEnabled 
        ? "bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 dark:from-red-600 dark:via-orange-600 dark:to-amber-600"
        : "bg-gradient-to-br from-slate-500 via-gray-500 to-stone-500 dark:from-slate-600 dark:via-gray-600 dark:to-stone-600",
      ring: nsfwEnabled 
        ? "focus-visible:ring-red-400"
        : "focus-visible:ring-slate-400",
      shimmerDelay: '0.6s'
    },
    {
      label: "Cài Đặt Chung",
      modal: ModalType.GeneralSettings,
      icon: "fas fa-cogs",
      gradient: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 dark:from-pink-600 dark:via-rose-600 dark:to-red-600",
      ring: "focus-visible:ring-pink-400",
      isGridFullSpan: true,
      shimmerDelay: '0.75s'
    },
  ];
  
  const AuthButtonDisplay = () => {
    if (isLoadingAuth || !isGisLoaded || !isGapiLoaded) {
      return (
        <Button
          className={`${getButtonBaseStyle(false)} bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 focus-visible:ring-gray-400 sm:col-span-2`}
          disabled={true}
          style={{ '--shimmer-delay': '0.9s' } as React.CSSProperties}
          aria-label="Đang tải Google Auth"
        >
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải Google Auth...
        </Button>
      );
    }

    if (isGoogleLoggedIn && googleUser) {
      return (
        <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-2 p-2.5 bg-green-500/10 dark:bg-green-700/20 rounded-xl border border-green-500/30 dark:border-green-600/40">
           <img src={googleUser.picture} alt={googleUser.name} className="w-8 h-8 rounded-full shadow-md" referrerPolicy="no-referrer" />
          <span className="text-xs sm:text-sm text-green-700 dark:text-green-200 font-medium">
            Đăng nhập với: {googleUser.name}
          </span>
          <Button
            onClick={signOutGoogle}
            className="!text-xs !py-1 !px-2.5 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400"
            aria-label="Đăng xuất Google"
          >
            <i className="fab fa-google mr-1.5"></i>Đăng xuất
          </Button>
        </div>
      );
    }

    return (
      <Button
        onClick={signInGoogle}
        className={`${getButtonBaseStyle(false)} bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 dark:from-blue-600 dark:via-sky-600 dark:to-cyan-600 focus-visible:ring-blue-400 sm:col-span-2`}
        style={{ '--shimmer-delay': '0.9s' } as React.CSSProperties}
        aria-label="Đăng nhập với Google"
      >
        <i className="fab fa-google mr-2 text-md"></i>Đăng nhập với Google (Drive Sync)
      </Button>
    );
  };


  return (
    <>
      <ParticleBackground />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-900 dark:via-background-dark dark:to-slate-800 transition-colors duration-300">
        <header className="text-center mb-10 sm:mb-12 z-10">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-secondary-dark dark:from-primary-light dark:via-blue-400 dark:to-secondary animate-text-gradient-wave mb-4"
              style={{ WebkitTextStroke: settings.theme === 'dark' ? '0.5px rgba(255,255,255,0.1)' : '1px rgba(0,0,0,0.05)', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            {APP_TITLE}
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Kiến tạo thế giới, hóa thân vào nhân vật, và để AI dẫn dắt bạn qua những cuộc phiêu lưu vô tận đậm chất tiểu thuyết mạng.
          </p>
        </header>

        <main className="w-full max-w-sm md:max-w-md lg:max-w-lg space-y-5 z-10">
          {buttonConfigs.slice(0, 1).map(btn => (
            <button
              key={btn.label}
              className={`${getButtonBaseStyle(btn.isLarge)} ${btn.gradient} ${btn.ring}`}
              style={{ '--shimmer-delay': btn.shimmerDelay } as React.CSSProperties}
              onClick={() => openModal(btn.modal)}
              aria-label={btn.label}
            >
              <i className={`${btn.icon} mr-3 ${btn.isLarge ? 'text-xl sm:text-2xl' : 'text-lg'}`}></i>{btn.label}
            </button>
          ))}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {buttonConfigs.slice(1).map(btn => (
              <button
                key={btn.label}
                className={`${getButtonBaseStyle(false)} ${btn.gradient} ${btn.ring} ${btn.isGridFullSpan ? 'sm:col-span-2' : ''}`}
                style={{ '--shimmer-delay': btn.shimmerDelay } as React.CSSProperties}
                onClick={() => openModal(btn.modal)}
                aria-label={btn.label}
              >
                <i className={`${btn.icon} mr-2 text-md`}></i>{btn.label}
              </button>
            ))}
            <AuthButtonDisplay />
          </div>
        </main>

        <footer className="mt-12 sm:mt-16 text-center text-sm text-slate-500 dark:text-slate-400 z-10">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}.</p>
          <p className="text-sm mt-1">Một sản phẩm được tạo ra với sự đồng hành của Trí Tuệ Nhân Tạo.</p>
          <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 mt-3">
              <i className="fas fa-code mr-1"></i> Thiết kế bởi @LocVinh04
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;