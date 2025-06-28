import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'Admin' ? 'Admin Dashboard' : 'Patient Portal'}
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">{user?.role}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};