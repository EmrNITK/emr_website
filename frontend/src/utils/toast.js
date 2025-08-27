import toast from 'react-hot-toast';

// Custom toast styles that match EMR theme
const toastStyles = {
  style: {
    background: '#050816',
    color: '#f3f3f3',
    border: '1px solid #aaa6c3',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: '500',
    boxShadow: '0px 35px 120px -15px #211e35',
    backdropFilter: 'blur(10px)',
  },
  success: {
    style: {
      background: 'linear-gradient(135deg, #050816 0%, #151030 100%)',
      color: '#f3f3f3',
      border: '1px solid #10b981',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0px 35px 120px -15px #211e35',
      backdropFilter: 'blur(10px)',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#f3f3f3',
    },
  },
  error: {
    style: {
      background: 'linear-gradient(135deg, #050816 0%, #151030 100%)',
      color: '#f3f3f3',
      border: '1px solid #ef4444',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0px 35px 120px -15px #211e35',
      backdropFilter: 'blur(10px)',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#f3f3f3',
    },
  },
  loading: {
    style: {
      background: 'linear-gradient(135deg, #050816 0%, #151030 100%)',
      color: '#f3f3f3',
      border: '1px solid #3b82f6',
      borderRadius: '12px',
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: '500',
      boxShadow: '0px 35px 120px -15px #211e35',
      backdropFilter: 'blur(10px)',
    },
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#f3f3f3',
    },
  },
};

// Large toast styles for important messages
const largeToastStyles = {
  style: {
    background: '#050816',
    color: '#f3f3f3',
    border: '1px solid #aaa6c3',
    borderRadius: '16px',
    padding: '24px 28px',
    fontSize: '18px',
    fontWeight: '600',
    boxShadow: '0px 35px 120px -15px #211e35',
    backdropFilter: 'blur(10px)',
    minWidth: '400px',
  },
  success: {
    style: {
      background: 'linear-gradient(135deg, #050816 0%, #151030 100%)',
      color: '#f3f3f3',
      border: '1px solid #10b981',
      borderRadius: '16px',
      padding: '24px 28px',
      fontSize: '18px',
      fontWeight: '600',
      boxShadow: '0px 35px 120px -15px #211e35',
      backdropFilter: 'blur(10px)',
      minWidth: '400px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#f3f3f3',
    },
  },
  error: {
    style: {
      background: 'linear-gradient(135deg, #050816 0%, #151030 100%)',
      color: '#f3f3f3',
      border: '1px solid #ef4444',
      borderRadius: '16px',
      padding: '24px 28px',
      fontSize: '18px',
      fontWeight: '600',
      boxShadow: '0px 35px 120px -15px #211e35',
      backdropFilter: 'blur(10px)',
      minWidth: '400px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#f3f3f3',
    },
  },
};

// Toast functions
export const showToast = {
  // Regular toasts
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      position: 'bottom-right',
      ...toastStyles.success,
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      position: 'bottom-right',
      ...toastStyles.error,
      ...options,
    });
  },
  
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'bottom-right',
      ...toastStyles.loading,
      ...options,
    });
  },
  
  // Large toasts for important messages
  largeSuccess: (message, options = {}) => {
    return toast.success(message, {
      duration: 6000,
      position: 'bottom-right',
      ...largeToastStyles.success,
      ...options,
    });
  },
  
  largeError: (message, options = {}) => {
    return toast.error(message, {
      duration: 7000,
      position: 'bottom-right',
      ...largeToastStyles.error,
      ...options,
    });
  },
  
  // Custom toast
  custom: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'bottom-right',
      ...toastStyles.style,
      ...options,
    });
  },
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
