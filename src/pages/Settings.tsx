import React, { useState } from 'react';
import { User, Database, Server, Bell, Shield, Save } from 'lucide-react';

interface SettingsForm {
  teamNumber: string;
  teamName: string;
  eventKey: string;
  dataRefreshRate: string;
  enableNotifications: boolean;
  autoBackup: boolean;
  darkMode: boolean;
  apiKey: string;
  customThemeColor: string;
}

const initialSettings: SettingsForm = {
  teamNumber: '6738',
  teamName: 'Excalibur',
  eventKey: '2025new',
  dataRefreshRate: '60',
  enableNotifications: true,
  autoBackup: true,
  darkMode: false,
  apiKey: '•••••••••••••••••',
  customThemeColor: '#012265',
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsForm>(initialSettings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings submitted:', settings);

    // Save the event key to localStorage
    localStorage.setItem('eventKey', settings.eventKey);

    // Here you would typically save this to Firebase
    alert('Settings saved successfully!');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500">Configure your strategy system preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User size={18} className="mr-2 text-primary-500" />
            Team Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="teamNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                Team Number
              </label>
              <input
                type="text"
                id="teamNumber"
                name="teamNumber"
                value={settings.teamNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-neutral-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={settings.teamName}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eventKey" className="block text-sm font-medium text-neutral-700 mb-1">
              Current Event Key
            </label>
            <input
              type="text"
              id="eventKey"
              name="eventKey"
              value={settings.eventKey}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder="e.g., 2023nychr"
            />
            <p className="mt-1 text-sm text-neutral-500">
              The event key is a unique identifier for the competition (e.g., "2025nychr" for NYC Regional)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Database size={18} className="mr-2 text-primary-500" />
            Data Settings
          </h2>

          <div className="mb-4">
            <label htmlFor="dataRefreshRate" className="block text-sm font-medium text-neutral-700 mb-1">
              Data Refresh Rate (seconds)
            </label>
            <select
              id="dataRefreshRate"
              name="dataRefreshRate"
              value={settings.dataRefreshRate}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="manual">Manual Refresh Only</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                name="autoBackup"
                checked={settings.autoBackup}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
              />
              <label htmlFor="autoBackup" className="ml-2 text-sm text-neutral-700">
                Automatically backup data to cloud
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Server size={18} className="mr-2 text-primary-500" />
            API Configuration
          </h2>

          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-700 mb-1">
              API Key
            </label>
            <div className="flex">
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={settings.apiKey}
                onChange={handleInputChange}
                className="flex-1 p-2 border border-neutral-300 rounded-l-md"
                placeholder="Enter your API key"
              />
              <button
                type="button"
                className="px-4 py-2 bg-neutral-100 text-neutral-700 border border-neutral-300 border-l-0 rounded-r-md hover:bg-neutral-200"
                onClick={() => alert('This would regenerate the API key')}
              >
                Regenerate
              </button>
            </div>
            <p className="mt-1 text-sm text-neutral-500">
              Used for external integrations. Keep this private!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Bell size={18} className="mr-2 text-primary-500" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
              />
              <label htmlFor="enableNotifications" className="ml-2 text-sm text-neutral-700">
                Enable notifications for upcoming matches
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Shield size={18} className="mr-2 text-primary-500" />
            Appearance
          </h2>

          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 text-sm text-neutral-700">
                Dark Mode (Coming Soon)
              </label>
            </div>

            <div>
              <label htmlFor="customThemeColor" className="block text-sm font-medium text-neutral-700 mb-1">
                Primary Theme Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="customThemeColor"
                  name="customThemeColor"
                  value={settings.customThemeColor}
                  onChange={handleInputChange}
                  className="h-10 w-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={settings.customThemeColor}
                  onChange={handleInputChange}
                  name="customThemeColor"
                  className="p-2 border border-neutral-300 rounded-md w-32"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;