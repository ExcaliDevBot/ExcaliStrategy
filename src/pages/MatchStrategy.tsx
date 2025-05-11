import React, { useState } from 'react';
import { Search, FileText, Clock } from 'lucide-react';
import MatchStrategyForm from '../components/strategy/MatchStrategyForm';
import MatchStrategyNotes from '../components/strategy/MatchStrategyNotes';

const MatchStrategy: React.FC = () => {
  const [matchNumber, setMatchNumber] = useState<string>('');
  const [view, setView] = useState<'form' | 'notes'>('form');
  
  // This would typically come from Firebase
  const matches = [
    { matchNumber: 24, time: '10:15 AM' },
    { matchNumber: 25, time: '10:30 AM' },
    { matchNumber: 26, time: '10:45 AM' },
    { matchNumber: 27, time: '11:00 AM' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Match Strategy</h1>
        <p className="text-neutral-500">Prepare and analyze match-by-match strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Match selector sidebar */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search match number..."
              className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
              value={matchNumber}
              onChange={(e) => setMatchNumber(e.target.value)}
            />
          </div>
          
          <h3 className="font-medium text-sm text-neutral-500 mb-2">Upcoming Matches</h3>
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {matches
              .filter(match => 
                matchNumber === '' || 
                match.matchNumber.toString().includes(matchNumber)
              )
              .map(match => (
                <button
                  key={match.matchNumber}
                  className="w-full flex items-center justify-between p-3 rounded-md text-left hover:bg-neutral-50 border border-neutral-200"
                  onClick={() => {
                    // This would typically set the selected match
                    alert(`Selected match ${match.matchNumber}`);
                  }}
                >
                  <div>
                    <div className="font-medium">Match {match.matchNumber}</div>
                  </div>
                  <div className="flex items-center text-sm text-neutral-500">
                    <Clock size={14} className="mr-1" />
                    {match.time}
                  </div>
                </button>
              ))}
            
            {matches.filter(match => 
              matchNumber === '' || 
              match.matchNumber.toString().includes(matchNumber)
            ).length === 0 && (
              <div className="text-center p-4 text-neutral-500">
                No matches found.
              </div>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="border-b border-neutral-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 font-medium text-sm flex items-center ${
                    view === 'form'
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  onClick={() => setView('form')}
                >
                  <FileText size={16} className="mr-2" />
                  Strategy Form
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm flex items-center ${
                    view === 'notes'
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  onClick={() => setView('notes')}
                >
                  <Search size={16} className="mr-2" />
                  Match Notes
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {view === 'form' ? <MatchStrategyForm /> : <MatchStrategyNotes />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchStrategy;