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
              info: entry.Info,
              l1: entry.L1,
              l2: entry.L2,
              l3: entry.L3,
              l4: entry.L4,
              autoL1: entry.autoL1,
              autoL2: entry.autoL2,
              autoL3: entry.autoL3,
              autoL4: entry.autoL4,
              autoRemoveAlgae: entry.autoRemoveAlgae,
              notes: entry.Notes,
              climbOption: entry.climbOption,
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

  const filteredMatches = matches
    .filter(
      (match) =>
        match.team.toString().includes(searchQuery) ||
        match.matchNumber.toString().includes(searchQuery)
    )
    .sort((a, b) => a.matchNumber - b.matchNumber);

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
        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading matches...</p>
          ) : filteredMatches.length > 0 ? (
            <table className="min-w-full sticky-table">
              <thead className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Match</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Team</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Alliance</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Info</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">L1</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">L2</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">L3</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">L4</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L1</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L2</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L3</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto L4</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto Remove Algae</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Climb Option</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Defensive Pins</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredMatches.map((match, index) => (
                  <tr key={index} className="hover:bg-blue-50 even:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm text-neutral-900 font-semibold text-center align-middle border-r border-gray-200">{match.matchNumber}</td>
                    <td className="py-3 px-4 text-sm text-neutral-900 font-semibold text-center align-middle border-r border-gray-200">{match.team}</td>
                    <td className={`py-3 px-4 text-sm font-bold text-center align-middle border-r border-gray-200 rounded ${String(match.alliance).toLowerCase() === 'red' ? 'bg-red-100 text-red-700' : String(match.alliance).toLowerCase() === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-neutral-900'}`}>{match.alliance}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.info}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.l1}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.l2}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.l3}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.l4}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.autoL1}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.autoL2}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.autoL3}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.autoL4}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.autoRemoveAlgae}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.climbOption}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.defensivePins}</td>
                    <td className="py-3 px-4 text-sm text-left align-middle">{match.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-6">No matches found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchScouting;
