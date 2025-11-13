import React from 'react';
import { Button } from './ui/Button';

export function Header({ session, signOut }) {
  const user = session?.user;

  return (
    <header className="w-full bg-gradient-to-r from-amber-50 to-amber-200 border-b border-amber-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-gray-800">
          Weekly Report Platform
        </h1>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-gray-700">
                {user.user_metadata?.full_name || user.email}
              </div>
              <Button variant="secondary" onClick={signOut} aria-label="Sign out">
                Sign Out
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-600">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}
