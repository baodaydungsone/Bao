
import React, { ReactNode, useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl' | '3xl';
  footer?: ReactNode;
  containerClass?: string;
}

const Modal: React.FC<ModalProps> = React.memo(({ isOpen, onClose, title, children, size = 'md', footer, containerClass = '' }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsShowing(true);
      document.body.style.overflow = 'hidden'; 
    } else {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (!document.querySelector('.fixed.inset-0.z-\\[100\\].opacity-100')) { // Check if any other modal is open
            document.body.style.overflow = ''; 
        }
      }, 300); 
      return () => clearTimeout(timer);
    }
    return () => {
       if (!document.querySelector('.fixed.inset-0.z-\\[100\\].opacity-100')) {
         document.body.style.overflow = '';
       }
    };
  }, [isOpen]);

  if (!isShowing && !isOpen) return null;

  let sizeClass = '';
  let dialogHeightClass = 'max-h-[90vh]'; // Default max height

  switch (size) {
    case 'sm': sizeClass = 'max-w-sm'; break;
    case 'md': sizeClass = 'max-w-md'; break;
    case 'lg': sizeClass = 'max-w-lg'; break;
    case 'xl': sizeClass = 'max-w-xl'; break;
    case '2xl': sizeClass = 'max-w-2xl'; break;
    case '3xl': sizeClass = 'max-w-3xl'; break;
    case 'full': 
      sizeClass = 'w-full h-full'; 
      dialogHeightClass = 'h-full max-h-full rounded-none sm:rounded-xl sm:max-h-[95vh]'; // Full height on mobile, slightly less on sm+
      break; 
    default: sizeClass = 'max-w-md';
  }

  const animationClass = isOpen ? 'animate-fadeIn' : 'animate-fadeOut';

  // For 'full' size on mobile, remove padding from the backdrop and make modal itself handle padding if needed
  const backdropPadding = size === 'full' ? 'p-0 sm:p-4' : 'p-4';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm ${backdropPadding} transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-card-light dark:bg-card-dark rounded-xl shadow-xl w-full ${sizeClass} ${dialogHeightClass} flex flex-col overflow-hidden ${animationClass} ${containerClass}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-light dark:border-border-dark flex-shrink-0">
          <h3 id="modal-title" className="text-lg sm:text-xl lg:text-2xl font-semibold text-text-light dark:text-text-dark">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-full p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close modal"
          >
            <i className="fas fa-times fa-lg"></i>
          </button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-grow custom-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-4 sm:p-5 border-t border-border-light dark:border-border-dark flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

export default Modal;
