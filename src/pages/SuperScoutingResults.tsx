import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, Database, DatabaseReference } from '../firebase/firebase.js';

interface ScoutingEntry2026 {
  Name?: string;
  Team?: string | number;
  Match?: string | number;
  Alliance?: 'Red' | 'Blue' | string;
  WinnerPrediction?: 'Red' | 'Blue' | 'Tie' | '';
  Notes?: string;
  auto2026StartX?: number | null;
  auto2026StartY?: number | null;
  auto2026FuelPoints?: { x: number; y: number }[];
  auto2026ClimbPerformed?: boolean;
  auto2026ClimbLevel?: 1 | 2 | 3 | null;
  auto2026ClimbSide?: 'left' | 'center' | 'right' | null;
  teleop2026AutoWinner?: 'red' | 'blue' | null;
  teleop2026MovedInAuto?: boolean | null;
  teleop2026DeliveryPoints?: { x: number; y: number }[];
  teleop2026ShotPoints?: { x: number; y: number }[];
  teleop2026EstimatedBalls?: number | null;
  submittedAt?: string;
  submitted_at?: string;
}

interface ScoutingResultCard {
  id: string;
  match_number: string | number;
  team_number: string | number;
  alliance: string;
  notes: string;
  name: string;
  submittedAt: string | null;
  auto2026StartX: number | null;
  auto2026StartY: number | null;
  auto2026FuelPoints: { x: number; y: number }[];
  auto2026ClimbPerformed: boolean;
  auto2026ClimbLevel: 1 | 2 | 3 | null;
  auto2026ClimbSide: 'left' | 'center' | 'right' | null;
  teleop2026AutoWinner: 'red' | 'blue' | null;
  teleop2026MovedInAuto: boolean | null;
  teleop2026DeliveryPoints: { x: number; y: number }[];
  teleop2026ShotPoints: { x: number; y: number }[];
  teleop2026EstimatedBalls: number | null;
}

const SuperScoutingResults: React.FC = () => {
  const [results, setResults] = useState<ScoutingResultCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const db: Database = getDatabase();
    const resultsRef: DatabaseReference = ref(db, 'scoutingData');

    onValue(resultsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, ScoutingEntry2026> | null;
      if (data) {
        const formatted: ScoutingResultCard[] = Object.entries(data).map(([key, entry]) => {
          const matchFromKey = key.match(/M(\d+)T/)?.[1] ?? '';
          const teamFromKey = key.match(/T(\d+)/)?.[1] ?? '';

          const match = entry.Match ?? matchFromKey;
          const team = entry.Team ?? teamFromKey;

          return {
            id: key,
            match_number: match,
            team_number: team,
            alliance: entry.Alliance ?? '',
            notes: entry.Notes ?? '',
            name: entry.Name ?? '',
            submittedAt: entry.submittedAt ?? entry.submitted_at ?? null,
            auto2026StartX: entry.auto2026StartX ?? null,
            auto2026StartY: entry.auto2026StartY ?? null,
            auto2026FuelPoints: Array.isArray(entry.auto2026FuelPoints) ? entry.auto2026FuelPoints : [],
            auto2026ClimbPerformed: Boolean(entry.auto2026ClimbPerformed),
            auto2026ClimbLevel: entry.auto2026ClimbLevel ?? null,
            auto2026ClimbSide: entry.auto2026ClimbSide ?? null,
            teleop2026AutoWinner: entry.teleop2026AutoWinner ?? null,
            teleop2026MovedInAuto: entry.teleop2026MovedInAuto ?? null,
            teleop2026DeliveryPoints: Array.isArray(entry.teleop2026DeliveryPoints) ? entry.teleop2026DeliveryPoints : [],
            teleop2026ShotPoints: Array.isArray(entry.teleop2026ShotPoints) ? entry.teleop2026ShotPoints : [],
            teleop2026EstimatedBalls: entry.teleop2026EstimatedBalls ?? null,
          };
        });
        setResults(formatted);
      } else {
        setResults([]);
      }
      setLoading(false);
    });
  }, []);

  const filteredResults = results.filter((result) => {
    const searchLower = search.toLowerCase();
    const teamMatch = String(result.team_number).toLowerCase().includes(searchLower);
    const matchMatch = String(result.match_number).toLowerCase().includes(searchLower);
    const notesMatch = (result.notes || '').toLowerCase().includes(searchLower);
    return teamMatch || matchMatch || notesMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Super Scouting Results</h1>
        <p className="text-center text-base text-gray-500 mb-6">Qualitative insights from super scouting (2026)</p>
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Filter by team, match number, or notes..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            {filteredResults.map((result: any) => (
              <div
                key={result.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-semibold text-blue-700 mr-3">Match #{result.match_number}</span>
                    <span className="text-sm font-semibold text-purple-700">Team #{result.team_number}</span>
                  </div>
                  {result.alliance && (
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        String(result.alliance).toLowerCase() === 'red'
                          ? 'bg-red-100 text-red-700'
                          : String(result.alliance).toLowerCase() === 'blue'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {result.alliance}
                    </span>
                  )}
                </div>

                {result.name && (
                  <div className="text-xs text-gray-500">
                    Scouter: <span className="font-medium text-gray-700">{result.name}</span>
                  </div>
                )}

                {result.notes && (
                  <div className="mt-1">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Notes</div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{result.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">Auto</div>
                    <ul className="space-y-1 text-gray-700">
                      <li>
                        Start: {result.auto2026StartX != null && result.auto2026StartY != null
                          ? `${result.auto2026StartX}, ${result.auto2026StartY}`
                          : 'N/A'}
                      </li>
                      <li>Fuel pickups: {result.auto2026FuelPoints.length}</li>
                      <li>
                        Climb: {result.auto2026ClimbPerformed
                          ? `Level ${result.auto2026ClimbLevel ?? '?'} (${result.auto2026ClimbSide || 'side ?'})`
                          : 'No climb'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1">Teleop</div>
                    <ul className="space-y-1 text-gray-700">
                      <li>Auto winner: {result.teleop2026AutoWinner || 'N/A'}</li>
                      <li>Moved in auto: {result.teleop2026MovedInAuto === true ? 'Yes' : result.teleop2026MovedInAuto === false ? 'No' : 'Unknown'}</li>
                      <li>Deliveries: {result.teleop2026DeliveryPoints.length}</li>
                      <li>Shots: {result.teleop2026ShotPoints.length}</li>
                      <li>Est. balls scored: {result.teleop2026EstimatedBalls ?? 'N/A'}</li>
                    </ul>
                  </div>
                </div>

                {result.submittedAt && (
                  <div className="mt-2 text-[11px] text-gray-400">
                    Submitted: {new Date(result.submittedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperScoutingResults;
