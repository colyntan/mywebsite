import React, { useState } from 'react';
import { Home, User, Settings, Bell } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Home</h2>
            <p>Welcome to the home screen!</p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Your profile information goes here.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <p>Your notifications will appear here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Adjust your settings here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 px-4 ${
                activeTab === id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;