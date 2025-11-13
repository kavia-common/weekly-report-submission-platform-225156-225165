import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';

export function Login() {
  const [toast, setToast] = useState(null);

  const signUp = async () => {
    const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/submit`,
      },
    });
    if (error) {
      setToast({
        type: 'error',
        message: error.message || 'Login failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto card p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Sign in to Continue</h2>
          <p className="text-gray-600 mt-2">Use your Google account to submit your weekly report.</p>
          <div className="mt-6">
            <Button
              onClick={signUp}
              className="w-full"
              variant="primary"
            >
              Sign in with Google
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            By continuing, you agree to our acceptable use and privacy guidelines. Be aware of this.
          </p>
        </div>
      </div>
      {toast && (
        <Toast type={toast.type} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
