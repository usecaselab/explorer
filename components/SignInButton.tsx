import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Shield } from 'lucide-react';
import { useSession, signOut } from '../lib/auth-client';
import { fetchIsAdmin } from '../lib/api';

export default function SignInButton() {
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    fetchIsAdmin().then(setIsAdmin).catch(() => setIsAdmin(false));
  }, [session?.user?.id]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  // Sign-in is invoked at the moment of action, not from the header.
  if (isPending || !session) return null;

  const user = session.user;
  const initials = (user.name || user.email || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || ''}
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-black hidden sm:inline">
          {user.name || user.email}
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-black truncate">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
          {isAdmin && (
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </a>
          )}
          <button
            onClick={async () => {
              await signOut();
              setMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
