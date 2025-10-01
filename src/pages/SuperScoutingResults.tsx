import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from '../firebase/firebase.js';

const SuperScoutingResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const resultsRef = ref(db, 'superScoutingResults');
    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data).map((entry: any) => ({
          match_number: entry.match_number,
          team_number: entry.team_number,
          questions: Array.isArray(entry.questions)
            ? entry.questions.filter((q: any) => q.answer && q.answer.trim() !== '')
            : [],
        }));
        setResults(formatted);
      }
      setLoading(false);
    });
  }, []);

  const filteredResults = results.filter(result => {
    const teamMatch = `${result.team_number}`.includes(search) || `${result.match_number}`.includes(search);
    return teamMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Super Scouting Results</h1>
        <p className="text-center text-base text-gray-500 mb-6">Qualitative insights from super scouting</p>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Filter by team or match number..."
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-base text-gray-500">Loading...</span>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-base text-gray-500">No results found.</span>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filteredResults.map((result, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-blue-700">Match #{result.match_number}</span>
                  <span className="text-sm font-semibold text-purple-700">Team #{result.team_number}</span>
                </div>
                <ul className="space-y-2">
                  {result.questions.map((q: any, qIdx: number) => (
                    <li key={qIdx} className="border-l-4 border-blue-400 pl-3 bg-blue-50 rounded">
                      <div className="text-sm text-gray-800 font-semibold mb-1">{q.question}</div>
                      <div className="text-sm text-gray-700">{q.answer}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperScoutingResults;
