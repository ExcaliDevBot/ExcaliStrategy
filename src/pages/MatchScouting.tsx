import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from '../firebase/firebase.js';

const MatchScouting: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = () => {
      const db = getDatabase();
      const matchesRef = ref(db, 'scoutingData');

      onValue(
        matchesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const formattedMatches = Object.values(data).map((entry: any) => ({
              matchNumber: entry.Match,
              team: entry.Team,
              alliance: entry.Alliance,
              notes: entry.Notes,
              climbOption: entry.climbOption,
              autoL1: entry.autoL1,
              autoL2: entry.autoL2,
              autoL3: entry.autoL3,
              autoL4: entry.autoL4,
              defensivePins: entry.defensivePins,
            }));
            setMatches(formattedMatches);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching matches:', error);
          setLoading(false);
        }
      );
    };

    fetchMatches();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredMatches = matches.filter(
    (match) =>
      match.team.toString().includes(searchQuery) ||
      match.matchNumber.toString().includes(searchQuery)
  );

  return (
    <div className="animate-fade-in p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Match Scouting</h1>
        <p className="text-gray-600">Record and analyze team performance during matches</p>
      </div>

      <div className="mb-6 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search by team or match number..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading matches...</p>
        ) : filteredMatches.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Match</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Team</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Alliance</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Climb Option</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L1</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L2</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L3</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L4</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Defensive Pins</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMatches.map((match, index) => (
                <tr key={index} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.matchNumber}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.team}</td>
                  <td className="py-3 px-4 text-sm">
                    {match.alliance ? (
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          match.alliance === 'Red' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      >
                        {match.alliance}
                      </span>
                    ) : (
                      <span className="text-neutral-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.climbOption}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.autoL1}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.autoL2}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.autoL3}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.autoL4}</td>
                  <td className="py-3 px-4 text-sm text-neutral-900">{match.defensivePins}</td>
                  <td className="py-3 px-4 text-sm text-neutral-500 max-w-[200px] truncate" title={match.notes}>
                    {match.notes || 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default MatchScouting;
