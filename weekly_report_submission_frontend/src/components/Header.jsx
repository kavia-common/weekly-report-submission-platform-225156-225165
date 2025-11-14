import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/Button';
import { supabase } from '../utils/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Header
 * Displays app title and current user identity with a circular user button.
 * On click, shows an accessible popover anchored beneath the button:
 *  - Displays the user's role text
 *  - Provides a Sign out button
 * Accessibility:
 *  - Keyboard operable, focus is trapped within popover while open
 *  - ESC closes popover
 *  - Click outside closes popover
 *  - ARIA attributes for button and popover (aria-expanded, aria-controls, role="dialog")
 */
export function Header({ session, signOut }) {
  const authUser = session?.user || null;

  // Local state for profile info and UI status
  const [profile, setProfile] = useState({ full_name: '', role: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  // Popover state/refs for accessibility management
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // A tiny skeleton width to avoid layout shift where the name/email appears
  const identitySkeleton = useMemo(
    () => (
      <span className="inline-block h-5 w-24 rounded bg-gray-200/70 align-middle" />
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

  // Avatar initials from name/email
  const initials = useMemo(() => {
    const source = displayName || '';
    const parts = source.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || 'U';
    return (authUser?.email?.[0] || 'U').toUpperCase();
  }, [displayName, authUser]);

  // Build role chip text
  const roleText = useMemo(() => {
    const role = (profile.role || '').trim();
    return role || 'Role: N/A';
  }, [profile.role]);

  // Close popover helper
  const closePopover = () => setOpen(false);

  // Accessible event handlers for outside click and ESC close
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePopover();
        // Return focus to button
        buttonRef.current?.focus();
      }
      // Basic focus trapping
      if (e.key === 'Tab' && popoverRef.current) {
        const focusable = popoverRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function onClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        closePopover();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onClickOutside, true);
    document.addEventListener('touchstart', onClickOutside, true);

    // Focus the first focusable inside popover on open
    const t = setTimeout(() => {
      const firstEl = popoverRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstEl) firstEl.focus();
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('mousedown', onClickOutside, true);
      document.removeEventListener('touchstart', onClickOutside, true);
    };
  }, [open]);

  // Sign out handler: use prop if provided, otherwise placeholder TODO
  const handleSignOut = async () => {
    if (typeof signOut === 'function') {
      await signOut();
    } else {
      // PUBLIC_INTERFACE
      // TODO: Integrate with actual sign-out logic from auth utils if available.
      // Placeholder: no-op to avoid errors.
      // eslint-disable-next-line no-console
      console.warn('Sign out handler not provided. TODO: wire to auth signOut().');
    }
    closePopover();
  };

  // Role badge (for inline optional use; not primary in this design)
  const roleBadge = useMemo(() => {
    const role = (profile.role || '').trim();
    if (!role) return null;

    let colorClasses =
      'bg-gray-100 text-gray-700 border border-gray-200'; // default neutral
    if (role.toLowerCase() === 'admin') {
      colorClasses = 'bg-amber-100 text-amber-800 border border-amber-200';
    } else if (role.toLowerCase() === 'manager') {
      colorClasses = 'bg-green-100 text-green-800 border border-green-200';
    } else if (role.toLowerCase() === 'employee') {
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
              {/* Live region for loading/error updates */}
              <span className="sr-only" aria-live="polite">
                {status.loading
                  ? 'Loading profile information'
                  : status.error
                  ? 'Profile info could not be fully loaded'
                  : ''}
              </span>

              {/* Circular user button */}
              <button
                ref={buttonRef}
                type="button"
                className="relative h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-soft hover:bg-amber-700 focus:outline-none"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="user-menu-popover"
                onClick={() => setOpen((o) => !o)}
                title={status.loading ? 'Loading...' : displayName}
              >
                {status.loading ? (
                  <span aria-hidden="true" className="animate-pulse inline-block h-5 w-5 rounded-full bg-amber-200" />
                ) : (
                  <span className="text-sm font-bold">{initials}</span>
                )}
              </button>

              {/* Optional inline role badge on larger screens */}
              {!status.error && roleBadge}

              {/* Popover */}
              {open && (
                <div
                  ref={popoverRef}
                  id="user-menu-popover"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="user-menu-heading"
                  className="absolute right-4 mt-12 z-50 w-64"
                >
                  <div className="card p-4 border border-amber-100 bg-white">
                    <h2 id="user-menu-heading" className="text-sm font-semibold text-gray-800">
                      Account
                    </h2>

                    <div className="mt-2 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-gray-800 border border-gray-200">
                          <span className="text-xs font-bold">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900" title={displayName}>
                            {status.loading ? identitySkeleton : displayName}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {status.error ? 'Role: unavailable' : roleText}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={closePopover}
                        className="px-3 py-1.5 text-sm"
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSignOut}
                        className="px-3 py-1.5 text-sm"
                        aria-label="Sign out"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-600">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}
