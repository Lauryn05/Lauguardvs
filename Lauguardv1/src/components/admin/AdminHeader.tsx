
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TO DO : Handle login
    navigate('/login');
  };

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Admin User
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
