import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DesktopComputerIcon,
  UserGroupIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/outline';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '/' },
  { name: 'Assets', icon: DesktopComputerIcon, href: '/assets' },
  { name: 'Employees', icon: UserGroupIcon, href: '/employees' },
  { name: 'Categories', icon: TagIcon, href: '/categories' },
  { name: 'Reports', icon: ChartBarIcon, href: '/reports' },
  { name: 'Settings', icon: CogIcon, href: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="h-full bg-gray-800 w-64 flex-shrink-0">
      <div className="px-3 py-4 flex flex-col h-full">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="mt-auto py-6">
          <div className="px-3">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Support</p>
            <div className="mt-2 space-y-1">
              <a href="/help" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium">
                Help Center
              </a>
              <a href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;