import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/Button';
import { supabase } from '../utils/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Header
 * Displays app title and current user identity with role badge.
 * - Fetches current Supabase auth user and corresponding profiles row.
 * - Renders "Full Name (Role)" or "email (Role)" with Champagne theme badge colors.
 * - Gracefully handles loading and error states without layout shift.
 *
 * Accessibility:
 * - Loading and error messages use aria-live="polite".
 * - Buttons and identity text have clear labels.
 */
export function Header({ session, signOut }) {
  const authUser = session?.user || null;

  // Local state for profile info and UI status
  const [profile, setProfile] = useState({ full_name: '', role: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  // A tiny skeleton width to avoid layout shift where the name/email appears
  const identitySkeleton = useMemo(
    () => (
      <span className="inline-block h-5 w-40 rounded bg-gray-200/70 align-middle" />
    ),
    []
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      // If no authenticated user, reset states
      if (!authUser?.id) {
        if (isMounted) {
          setProfile({ full_name: '', role: '' });
          setStatus({ loading: false, error: '' });
        }
        return;
      }

      setStatus({ loading: true, error: '' });

      try {
        // Get latest auth user to ensure freshness (no sensitive logs)
        const { data: sessionData, error: sessionErr } = await supabase.auth.getUser();
        if (sessionErr) {
          // Do not expose details to user, keep error subtle
          if (isMounted) {
            setStatus({
              loading: false,
              error: 'We could not load your profile fully.',
            });
          }
          return;
        }
        const u = sessionData?.user;
        if (!u?.id) {
          if (isMounted) {
            setStatus({ loading: false, error: '' });
          }
          return;
        }

        // Fetch profile with matching id
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', u.id)
          .single();

        if (error) {
          // On error, show identity without role (graceful degradation)
          if (isMounted) {
            setProfile({ full_name: '', role: '' });
            setStatus({
              loading: false,
              error: 'Profile role unavailable.',
            });
          }
          return;
        }

        if (isMounted) {
          setProfile({
            full_name: data?.full_name || '',
            role: data?.role || '',
          });
          setStatus({ loading: false, error: '' });
        }
      } catch {
        // Avoid logging sensitive data; keep message generic for UI
        if (isMounted) {
          setStatus({
            loading: false,
            error: 'Profile information not available.',
          });
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [authUser?.id]);

  // Determine display name: prefer profiles.full_name, fallback to auth metadata.full_name, then email
  const displayName = useMemo(() => {
    if (!authUser) return 'Guest';
    return (
      (profile.full_name && profile.full_name.trim()) ||
      (authUser.user_metadata?.full_name && authUser.user_metadata.full_name.trim()) ||
      authUser.email ||
      'User'
    );
  }, [authUser, profile.full_name]);

  // Build role badge with Champagne theme colors
  const roleBadge = useMemo(() => {
    const role = (profile.role || '').trim();
    if (!role) return null;

    let colorClasses =
      'bg-gray-100 text-gray-700 border border-gray-200'; // default neutral
    if (role.toLowerCase() === 'admin') {
      // primary amber
      colorClasses = 'bg-amber-100 text-amber-800 border border-amber-200';
    } else if (role.toLowerCase() === 'manager') {
      // success green
      colorClasses = 'bg-green-100 text-green-800 border border-green-200';
    } else if (role.toLowerCase() === 'employee') {
      // secondary cool gray
      colorClasses = 'bg-gray-100 text-gray-700 border border-gray-200';
    }

    return (
      <span
        className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
        aria-label={`Role ${role}`}
        title={`Role: ${role}`}
      >
        {role}
      </span>
    );
  }, [profile.role]);

  return (
    <header className="w-full bg-gradient-to-r from-amber-50 to-amber-200 border-b border-amber-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-gray-800">
          Weekly Report Platform
        </h1>

        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <div className="text-sm text-gray-700 flex items-center">
                {/* Loading/Error Region for accessibility */}
                <span className="sr-only" aria-live="polite">
                  {status.loading
                    ? 'Loading profile information'
                    : status.error
                    ? 'Profile info could not be fully loaded'
                    : ''}
                </span>

                {/* Identity text with minimal layout shift */}
                <span className="align-middle">
                  {status.loading ? (
                    identitySkeleton
                  ) : (
                    <>
                      <span>{displayName}</span>
                      {/* Role badge (only when available); if error, omit badge */}
                      {!status.error && roleBadge}
                    </>
                  )}
                </span>
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
