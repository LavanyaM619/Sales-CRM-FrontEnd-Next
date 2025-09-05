'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // 🔹 If page requires admin but user isn’t admin → send them to user dashboard
      if (requireAdmin && !isAdmin) {
        router.push('/user/dashboard');
        return;
      }

      // 🔹 If page is for normal users only, but user is admin → send them to admin dashboard
      // if (!requireAdmin && isAdmin) {
      //   router.push('/dashboard');
      //   return;
      // }
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
};
