import React from 'react';
import { X } from 'lucide-react';
import { Dialog } from '@headlessui/react';

type UserInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; email: string }) => void;
  type: 'download' | 'email';
  isLoading: boolean;
};

export default function UserInfoModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  isLoading
}: UserInfoModalProps) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({ fullName: '', email: '' });

  const validateForm = () => {
    const newErrors = { fullName: '', email: '' };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else if (!email.includes('.edu') && !email.includes('.ac.')) {
      newErrors.email = 'Please use your institutional email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ fullName, email });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {type === 'download' ? 'Download Results' : 'Email Results'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-4">
              By submitting this form, you agree to our privacy policy. We'll only use your information
              to process your request and may contact you about our institutional services.
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}