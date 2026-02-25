import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from '../firebase/firebase.js';

const MatchScouting: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

  useEffect(() => {
    const fetchMatches = () => {
      const db = getDatabase();
      const matchesRef = ref(db, 'scoutingData');

      onValue(
        matchesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const formattedMatches = Object.entries<any>(data).map(([key, entry]) => {
              const match = typeof entry.Match === 'string' || typeof entry.Match === 'number'
                ? entry.Match
                : key.match(/M(\d+)T/)?.[1] ?? '';
              const team = typeof entry.Team === 'string' || typeof entry.Team === 'number'
                ? entry.Team
                : key.match(/T(\d+)/)?.[1] ?? '';

              return {
                id: key,
                matchNumber: match,
                team: team,
                alliance: entry.Alliance,
                winnerPrediction: entry.WinnerPrediction ?? '',
                notes: entry.Notes ?? '',
                auto2026StartX: entry.auto2026StartX ?? null,
                auto2026StartY: entry.auto2026StartY ?? null,
                auto2026FuelPoints: Array.isArray(entry.auto2026FuelPoints) ? entry.auto2026FuelPoints : [],
                auto2026ClimbPerformed: !!entry.auto2026ClimbPerformed,
                auto2026ClimbLevel: entry.auto2026ClimbLevel ?? null,
                auto2026ClimbSide: entry.auto2026ClimbSide ?? null,
                teleop2026AutoWinner: entry.teleop2026AutoWinner ?? null,
                teleop2026MovedInAuto: entry.teleop2026MovedInAuto ?? null,
                teleop2026DeliveryPoints: Array.isArray(entry.teleop2026DeliveryPoints) ? entry.teleop2026DeliveryPoints : [],
                teleop2026ShotPoints: Array.isArray(entry.teleop2026ShotPoints) ? entry.teleop2026ShotPoints : [],
                teleop2026EstimatedBalls: entry.teleop2026EstimatedBalls ?? null,
              };
            });
            setMatches(formattedMatches);
          } else {
            setMatches([]);
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
    .filter((match: any) => {
      const q = searchQuery.toLowerCase();
      return (
        String(match.team).toLowerCase().includes(q) ||
        String(match.matchNumber).toLowerCase().includes(q) ||
        (match.notes || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => Number(a.matchNumber) - Number(b.matchNumber));

  return (
    <div className="animate-fade-in p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Match Scouting (2026)</h1>
        <p className="text-gray-600">Record and analyze team performance during matches</p>
      </div>

      <div className="mb-6 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search by team, match number, or notes..."
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto Start</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto Fuel</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto Climb</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Teleop Auto Winner</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Moved in Auto</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Deliveries</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Shots</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Est. Balls</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredMatches.map((match: any) => (
                  <tr
                    key={match.id}
                    className="hover:bg-blue-50 even:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedMatch(match)}
                  >
                    <td className="py-3 px-4 text-sm text-neutral-900 font-semibold text-center align-middle border-r border-gray-200">{match.matchNumber}</td>
                    <td className="py-3 px-4 text-sm text-neutral-900 font-semibold text-center align-middle border-r border-gray-200">{match.team}</td>
                    <td className={`py-3 px-4 text-sm font-bold text-center align-middle border-r border-gray-200 rounded ${
                      String(match.alliance).toLowerCase() === 'red'
                        ? 'bg-red-100 text-red-700'
                        : String(match.alliance).toLowerCase() === 'blue'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-neutral-900'
                    }`}>{match.alliance}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">
                      {match.auto2026StartX != null && match.auto2026StartY != null
                        ? `${match.auto2026StartX}, ${match.auto2026StartY}`
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.auto2026FuelPoints.length}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">
                      {match.auto2026ClimbPerformed
                        ? `L${match.auto2026ClimbLevel ?? '?'} (${match.auto2026ClimbSide || 'side ?'})`
                        : 'No climb'}
                    </td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.teleop2026AutoWinner || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">
                      {match.teleop2026MovedInAuto === true
                        ? 'Yes'
                        : match.teleop2026MovedInAuto === false
                        ? 'No'
                        : 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.teleop2026DeliveryPoints.length}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.teleop2026ShotPoints.length}</td>
                    <td className="py-3 px-4 text-sm text-center align-middle border-r border-gray-200">{match.teleop2026EstimatedBalls ?? 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-left align-middle max-w-xs truncate" title={match.notes}>
                      {match.notes}
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

      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedMatch(null)}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-4 md:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-sm"
              onClick={() => setSelectedMatch(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-2">
              Match {selectedMatch.matchNumber} – Team {selectedMatch.team}
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Click outside this box or the X to close.
            </p>

            <p className="text-[10px] md:text-xs text-gray-500 mb-3 leading-snug">
              Coordinate system for all plotted points (for strategy tools):
              x and y are normalized grid coordinates on the field image.
              Both are integers from 0 to 100, representing percentages of the
              image dimensions (not pixels, not field meters). Axes are defined
              by the browser rendering of 2026field.png: x = 0 is the left edge,
              x = 100 the right edge, y = 0 the top edge, y = 100 the bottom.
              These are strictly image-relative (not robot-centric, not
              alliance-flipped). If you want red/blue normalization, apply your
              own transform based on alliance and which side of the field the
              image represents.
            </p>

            <div
              className="border rounded-lg bg-black relative overflow-hidden"
              style={{
                aspectRatio: '2 / 1',
                backgroundImage: 'url(/2026field.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Auto fuel points (yellow)
                  Coordinate type: x and y are integer percentages 0–100 of the
                  field image (normalized coordinates).
                  How they are produced: on click, we get relX, relY in [0,1]
                  and store x = round(relX * 100), y = round(relY * 100).
                  Rendering: we use `${p.x}%` for left and `${100 - p.y}%` for top
                  so that y = 0 is the top of the image and y = 100 the bottom,
                  matching the stored convention.
                  Strategy usage: treat each point as
                    field_x = x / 100 * field_width_in_your_units
                    field_y = y / 100 * field_height_in_your_units
                  and apply any alliance-based transforms in your own system.
              */}
              {selectedMatch.auto2026FuelPoints?.map((p: { x: number; y: number }, idx: number) => (
                <div
                  key={`auto-${idx}`}
                  className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400 border border-yellow-200 shadow"
                  style={{
                    left: `calc(${p.x}% - 6px)` ,
                    top: `calc(${100 - p.y}% - 6px)` ,
                  }}
                  title={`Auto fuel (${p.x}, ${p.y})`}
                />
              ))}

              {/* Teleop delivery points (green) – same normalized coordinate system */}
              {selectedMatch.teleop2026DeliveryPoints?.map((p: { x: number; y: number }, idx: number) => (
                <div
                  key={`del-${idx}`}
                  className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400 border border-green-200 shadow"
                  style={{
                    left: `calc(${p.x}% - 6px)` ,
                    top: `calc(${100 - p.y}% - 6px)` ,
                  }}
                  title={`Teleop delivery (${p.x}, ${p.y})`}
                />
              ))}

              {/* Teleop shot points (red) – same normalized coordinate system */}
              {selectedMatch.teleop2026ShotPoints?.map((p: { x: number; y: number }, idx: number) => (
                <div
                  key={`shot-${idx}`}
                  className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400 border border-red-200 shadow"
                  style={{
                    left: `calc(${p.x}% - 6px)` ,
                    top: `calc(${100 - p.y}% - 6px)` ,
                  }}
                  title={`Teleop shot (${p.x}, ${p.y})`}
                />
              ))}

              <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] md:text-xs text-white bg-black/60 px-2 py-1 rounded">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full" /> Auto fuel</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> Teleop delivery</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> Teleop shot</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScouting;
