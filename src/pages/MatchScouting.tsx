import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import ScoutingForm from '../components/scouting/ScoutingForm';
import ScoutingHistory from '../components/scouting/ScoutingHistory';

const MatchScouting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Match Scouting</h1>
        <p className="text-neutral-500">Record team performance during matches</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-neutral-200">
          <div className="flex">
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'new'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              onClick={() => setActiveTab('new')}
            >
              <PlusCircle size={16} className="mr-2" />
              New Scouting Entry
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'history'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <Search size={16} className="mr-2" />
              Scouting History
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'new' ? <ScoutingForm /> : <ScoutingHistory />}
        </div>
      </div>
    </div>
  );
};

export default MatchScouting;