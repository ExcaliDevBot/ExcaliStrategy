import React, { useState } from 'react';
import AllianceTeamCard from '../components/alliance/AllianceTeamCard';
import AllianceRecommendations from '../components/alliance/AllianceRecommendations';
import AllianceBuilder from '../components/alliance/AllianceBuilder';

const AllianceSelection: React.FC = () => {
  const [view, setView] = useState<'recommendations' | 'builder'>('recommendations');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Alliance Selection</h1>
        <p className="text-neutral-500">Choose the best alliance partners based on performance data</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-neutral-200">
          <div className="flex">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                view === 'recommendations'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              onClick={() => setView('recommendations')}
            >
              Alliance Recommendations
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                view === 'builder'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              onClick={() => setView('builder')}
            >
              Alliance Builder
            </button>
          </div>
        </div>

        <div className="p-4">
          {view === 'recommendations' ? (
            <AllianceRecommendations />
          ) : (
            <AllianceBuilder />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllianceSelection;