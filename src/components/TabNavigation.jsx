import React from 'react';
import { Link2, Star, Wifi } from 'lucide-react';
import clsx from 'clsx';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'link',
      label: 'Gerar QR para Link',
      icon: Link2,
    },
    {
      id: 'review',
      label: 'Gerar QR para Google Review',
      icon: Star,
    },
    {
      id: 'wifi',
      label: 'Gerar QR para WiFi',
      icon: Wifi,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-all duration-200',
                'hover:bg-white focus:outline-none relative',
                activeTab === tab.id
                  ? 'text-primary-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === 'link' ? 'Link' : tab.id === 'review' ? 'Review' : 'WiFi'}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;