'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {  LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login'); 
  };

  return (
    <header className="shadow-sm border-b bg-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left side: optional search or logo */}
        <div className="flex items-center space-x-4">
          
        </div>

        {/* Right side: user info and logout */}
        <div className="flex items-center space-x-4">
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
