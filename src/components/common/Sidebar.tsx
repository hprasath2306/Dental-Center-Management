import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Activity,
  Stethoscope 
} from 'lucide-react';

const adminNavItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/calendar', icon: Activity, label: 'Calendar View' },
];

const patientNavItems = [
  { to: '/patient-dashboard', icon: Home, label: 'Dashboard' },
  { to: '/patient-appointments', icon: Calendar, label: 'My Appointments' },
  { to: '/patient-records', icon: FileText, label: 'Medical Records' },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navItems = user?.role === 'Admin' ? adminNavItems : patientNavItems;

  return (
    <div className="bg-white w-64 shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-8 h-8 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">DentalCare</h2>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};