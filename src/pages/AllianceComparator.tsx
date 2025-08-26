import React, { useEffect, useState, useCallback } from 'react';
import { teamDataService, TeamPerformanceData } from '../services/teamDataService';
import { Scale, RefreshCw, X } from 'lucide-react';
import { fetchEventTeams, EventTeam } from '../services/tbaService';

interface AllianceSlotProps {
  color: 'red' | 'blue';
  index: number;
  value: number | '';
  onChange: (value: number | '') => void;
  loading: boolean;
  teams: EventTeam[];
  taken: Set<number>;
  open: boolean;
  onToggle: () => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

const AllianceSlot: React.FC<AllianceSlotProps> = ({ color, index, value, onChange, loading, teams, taken, open, onToggle, searchValue, onSearchChange }) => {
   const placeholder = 'Select team';
   const current = value === '' ? null : teams.find(t => t.teamNumber === value);
   const filtered = teams.filter(t =>
     (searchValue === '' || t.teamNumber.toString().includes(searchValue) || t.teamName.toLowerCase().includes(searchValue.toLowerCase())) &&
     (!taken.has(t.teamNumber) || t.teamNumber === value)
   ).slice(0, 60); // limit render
   return (
    <div className={`relative group alliance-slot-pop ${open ? 'z-30' : ''}`}>
      <label className="block text-[10px] font-semibold tracking-wide mb-1 text-neutral-600 uppercase">
        {color === 'red' ? 'Red' : 'Blue'} {index + 1}
      </label>
      <button
        type="button"
        disabled={loading}
        onClick={onToggle}
        className={`w-full flex items-center justify-between rounded-md border px-2 py-2 text-sm transition shadow-sm ${open ? 'ring-2 ring-primary-400' : 'ring-0'} ${color==='red' ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-blue-200 bg-blue-50 hover:bg-blue-100'} disabled:opacity-50`}
      >
        <span className={`truncate text-left ${!current ? 'text-neutral-400' : 'text-neutral-800 font-medium'}`}>{current ? `${current.teamNumber} – ${current.teamName}` : placeholder}</span>
        <span className="ml-2 flex items-center gap-1">
          {value !== '' && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(''); if(!open) return; }}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X size={14} />
            </span>
          )}
          <svg className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
        </span>
      </button>
      {open && (
        <div className={`absolute mt-1 w-full rounded-md border bg-white shadow-lg max-h-72 flex flex-col ${color==='red' ? 'border-red-200' : 'border-blue-200'}`}>
          <div className="p-1 border-b bg-neutral-50">
            <input
              autoFocus
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search (# / name)"
              className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
            <ul className="overflow-y-auto text-xs divide-y divide-neutral-100">
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-neutral-400">No matches</li>
              )}
              {filtered.map(t => {
                const disabled = taken.has(t.teamNumber) && t.teamNumber !== value;
                return (
                  <li key={t.teamNumber}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => { onChange(t.teamNumber); onToggle(); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-primary-50 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <span className="truncate font-medium text-neutral-700">{t.teamNumber}</span>
                      <span className="ml-2 flex-1 truncate text-neutral-500 text-[11px]">{t.teamName}</span>
                      {value === t.teamNumber && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary-100 text-primary-600">Selected</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="p-1 border-t bg-neutral-50 flex justify-end gap-1">
              <button onClick={()=>{ onSearchChange(''); }} className="px-2 py-1 text-[10px] rounded bg-white border hover:bg-neutral-50">Clear</button>
              <button onClick={()=> onToggle()} className="px-2 py-1 text-[10px] rounded bg-primary-500 text-white hover:bg-primary-600">Close</button>
            </div>
        </div>
      )}
      {value !== '' && taken.has(value as number) && (
        <p className="mt-1 text-[10px] text-red-600">Duplicate team selected</p>
      )}
    </div>
  );
};

const metricLabels: { key: keyof TeamPerformanceData['calculatedMetrics'] | 'opr' | 'dpr' | 'ccwm' | 'defense' | 'trend'; label: string }[] = [
  { key: 'avgAutoScore', label: 'Auto' },
  { key: 'avgTeleopScore', label: 'Teleop' },
  { key: 'avgEndgameScore', label: 'Endgame' },
  { key: 'avgTotalScore', label: 'Total' },
  { key: 'climbSuccessRate', label: 'Climb %' },
  { key: 'consistencyRating', label: 'Consistency' },
  { key: 'opr', label: 'OPR' },
  { key: 'dpr', label: 'DPR' },
  { key: 'ccwm', label: 'CCWM' },
  { key: 'defense', label: 'Defense' },
  { key: 'trend', label: 'Trend' }
];

const AllianceComparator: React.FC = () => {
  const [redAlliance, setRedAlliance] = useState<(number | '')[]>(['', '', '']);
  const [blueAlliance, setBlueAlliance] = useState<(number | '')[]>(['', '', '']);
  const [redData, setRedData] = useState<TeamPerformanceData[]>([]);
  const [blueData, setBlueData] = useState<TeamPerformanceData[]>([]);
  const [comparisonText, setComparisonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<EventTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [openSlot, setOpenSlot] = useState<{color:'red'|'blue'; index:number} | null>(null);
  const [slotSearch, setSlotSearch] = useState<string>('');
  function toggleSlot(color:'red'|'blue', index:number) {
    setSlotSearch('');
    setOpenSlot(prev => (prev && prev.color===color && prev.index===index) ? null : {color,index});
  }

  useEffect(() => {
    const loadTeams = async () => {
      setTeamsLoading(true);
      const list = await fetchEventTeams();
      setTeams(list);
      setTeamsLoading(false);
    };
    loadTeams();
  }, []);

  // Recompute if selection changed to clear outdated analysis when slots emptied
  useEffect(() => {
    if ([...redAlliance, ...blueAlliance].some(v => v === '')) {
      setComparisonText('Fill or compare current selections to view analysis.');
    }
  }, [redAlliance, blueAlliance]);

  const fetchAllianceData = useCallback(async () => {
    setLoading(true);
    try {
      const redNums = redAlliance.filter((n): n is number => typeof n === 'number');
      const blueNums = blueAlliance.filter((n): n is number => typeof n === 'number');
      const [redFetched, blueFetched] = await Promise.all([
        teamDataService.getAllTeamsData(redNums),
        teamDataService.getAllTeamsData(blueNums)
      ]);
      setRedData(redFetched);
      setBlueData(blueFetched);
      if (redFetched.length && blueFetched.length) {
        setComparisonText(teamDataService.compareAlliances(redFetched, blueFetched));
      } else {
        setComparisonText('Add at least one team to each alliance to generate a comparison.');
      }
    } catch (e) {
      console.error(e);
      setComparisonText('Error fetching data.');
    } finally {
      setLoading(false);
    }
  }, [redAlliance, blueAlliance]);

  useEffect(() => {
    // Auto fetch when all 6 slots filled
    const allFilled = [...redAlliance, ...blueAlliance].every(n => n !== '');
    if (allFilled) fetchAllianceData();
  }, [redAlliance, blueAlliance, fetchAllianceData]);

  const totalScore = (arr: TeamPerformanceData[]) => arr.reduce((s,t)=> s + t.calculatedMetrics.avgTotalScore, 0);
  const taken = new Set<number>([...redAlliance, ...blueAlliance].filter((v): v is number => v !== ''));

  // Pre-calc maxima for highlight
  const allTeams = [...redData, ...blueData];
  const maxValues = {
    avgAutoScore: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.avgAutoScore || 0)),
    avgTeleopScore: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.avgTeleopScore || 0)),
    avgEndgameScore: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.avgEndgameScore || 0)),
    avgTotalScore: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.avgTotalScore || 0)),
    climbSuccessRate: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.climbSuccessRate || 0)),
    consistencyRating: Math.max(0, ...allTeams.map(t => t.calculatedMetrics.consistencyRating || 0)),
    opr: Math.max(0, ...allTeams.map(t => t.stats.opr || 0)),
    dpr: Math.max(0, ...allTeams.map(t => t.stats.dpr || 0)),
    ccwm: Math.max(0, ...allTeams.map(t => t.stats.ccwm || 0)),
    defenseRating: Math.max(0, ...allTeams.map(t => t.stats.defenseRating || 0))
  };

  const allianceCard = (label: string, color: 'red'|'blue', data: TeamPerformanceData[]) => {
    const total = data.reduce((s,t)=> s + t.calculatedMetrics.avgTotalScore, 0);
    const maxTotal = Math.max(totalScore(redData), totalScore(blueData), 1);
    const pct = (total / maxTotal) * 100;
    const avgAuto = data.reduce((s,t)=> s + t.calculatedMetrics.avgAutoScore, 0) / (data.length||1);
    const avgTele = data.reduce((s,t)=> s + t.calculatedMetrics.avgTeleopScore, 0) / (data.length||1);
    const barColor = color==='red' ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-blue-500 to-sky-400';
    return (
      <div className={`relative rounded-xl border p-4 overflow-hidden ${color==='red' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm tracking-wide flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${color==='red'?'bg-red-500':'bg-blue-500'}`}></span>{label}
          </h3>
          <span className="text-xs text-neutral-500">{data.length} team(s)</span>
        </div>
        <div className="mb-2">
          <div className="flex justify-between text-[11px] font-medium text-neutral-600 mb-1">
            <span>Total Projection</span><span>{total.toFixed(1)}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/60 border border-white/70 overflow-hidden">
            <div className={`h-full ${barColor}`} style={{width: pct + '%'}}></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px] leading-tight">
          <div className="bg-white/70 rounded-md p-1.5 text-center"><div className="font-semibold text-neutral-700">{avgAuto.toFixed(1)}</div><div className="uppercase tracking-wider text-[9px] text-neutral-500">Auto</div></div>
          <div className="bg-white/70 rounded-md p-1.5 text-center"><div className="font-semibold text-neutral-700">{avgTele.toFixed(1)}</div><div className="uppercase tracking-wider text-[9px] text-neutral-500">Tele</div></div>
          <div className="bg-white/70 rounded-md p-1.5 text-center"><div className="font-semibold text-neutral-700">{(total/(data.length||1)).toFixed(1)}</div><div className="uppercase tracking-wider text-[9px] text-neutral-500">Avg Tot</div></div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center"><Scale size={24} className="mr-2 text-primary-500"/>Alliance Comparator</h1>
          <p className="text-neutral-500">Compare projected performance of two alliances (3 vs 3)</p>
          {teamsLoading && <p className="text-xs text-neutral-400 mt-1">Loading teams...</p>}
        </div>
        <button
          onClick={fetchAllianceData}
          className="inline-flex items-center px-3 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
          disabled={loading || teamsLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`}/>Compare
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {allianceCard('Red Alliance', 'red', redData)}
        {allianceCard('Blue Alliance', 'blue', blueData)}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h2 className="font-semibold mb-3 text-red-600">Red Alliance</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {redAlliance.map((val, i) => (
              <AllianceSlot
                key={i}
                color="red"
                index={i}
                value={val}
                loading={loading || teamsLoading}
                teams={teams}
                taken={taken}
                open={openSlot?.color==='red' && openSlot.index===i}
                onToggle={() => (typeof toggleSlot === 'function' ? toggleSlot('red', i) : setOpenSlot({color:'red', index:i}))}
                searchValue={openSlot?.color==='red' && openSlot.index===i ? slotSearch : ''}
                onSearchChange={setSlotSearch}
                onChange={(v) => setRedAlliance(prev => prev.map((p, idx) => idx === i ? v : p))}
              />
            ))}
          </div>
          <AllianceSummary data={redData} color="red" />
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h2 className="font-semibold mb-3 text-blue-600">Blue Alliance</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {blueAlliance.map((val, i) => (
              <AllianceSlot
                key={i}
                color="blue"
                index={i}
                value={val}
                loading={loading || teamsLoading}
                teams={teams}
                taken={taken}
                open={openSlot?.color==='blue' && openSlot.index===i}
                onToggle={() => (typeof toggleSlot === 'function' ? toggleSlot('blue', i) : setOpenSlot({color:'blue', index:i}))}
                searchValue={openSlot?.color==='blue' && openSlot.index===i ? slotSearch : ''}
                onSearchChange={setSlotSearch}
                onChange={(v) => setBlueAlliance(prev => prev.map((p, idx) => idx === i ? v : p))}
              />
            ))}
          </div>
          <AllianceSummary data={blueData} color="blue" />
        </div>
      </div>

      {(redData.length || blueData.length) && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 rounded bg-primary-400"/>Alliance Metrics Overview</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="px-4 py-2 rounded-md bg-red-50 border border-red-200 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500"/>
               Red Total Score: <span className="font-semibold">{totalScore(redData).toFixed(1)}</span>
             </div>
            <div className="px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"/>
               Blue Total Score: <span className="font-semibold">{totalScore(blueData).toFixed(1)}</span>
             </div>
            <div className="px-4 py-2 rounded-md bg-neutral-50 border border-neutral-200 text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-neutral-400"/>
               Differential: <span className="font-semibold">{(totalScore(redData) - totalScore(blueData)).toFixed(1)}</span>
             </div>
           </div>
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-neutral-50">
                 <tr>
                  <th className="p-2 border-b border-neutral-200 text-left sticky left-0 bg-neutral-50">Alliance</th>
                  <th className="p-2 border-b border-neutral-200 text-left sticky left-14 bg-neutral-50">Team</th>
                   {metricLabels.map(m => (
                    <th key={m.key} className="p-2 border-b border-neutral-200 text-right whitespace-nowrap font-medium text-neutral-600">{m.label}</th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                {redData.map(team => (
                  <MetricsRow key={`r-${team.teamNumber}`} team={team} alliance="Red" maxValues={maxValues} />
                ))}
                {blueData.map(team => (
                  <MetricsRow key={`b-${team.teamNumber}`} team={team} alliance="Blue" maxValues={maxValues} />
                ))}
                 {!redData.length && !blueData.length && (
                   <tr><td colSpan={metricLabels.length + 2} className="p-4 text-center text-neutral-500">Enter team numbers to view metrics.</td></tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
       )}

      <div className="bg-gradient-to-br from-primary-50 to-neutral-50 border border-neutral-200 rounded-xl p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><span className="w-1.5 h-5 rounded bg-primary-400"/>Analysis</h3>
        <div className="text-xs md:text-sm leading-relaxed font-mono bg-white/70 backdrop-blur-sm p-3 rounded border border-neutral-200 max-h-72 overflow-y-auto whitespace-pre-wrap shadow-inner">
          {comparisonText || 'Select teams then press Compare to generate analysis.'}
        </div>
       </div>
     </div>
   );
 };

const MetricsRow: React.FC<{ team: TeamPerformanceData; alliance: 'Red' | 'Blue'; maxValues: Record<string, number> }> = ({ team, alliance, maxValues }) => {
   const safeNum = (n: unknown, decimals = 1) => typeof n === 'number' && isFinite(n) ? n.toFixed(decimals) : '-';
   const { calculatedMetrics, stats } = team;
   const highlight = (val: number | undefined, key: keyof typeof maxValues, format: (v:number)=>string = v=>String(v)) => {
     if (val === undefined || !isFinite(val)) return '-';
     const isBest = val === maxValues[key];
     return <span className={isBest ? 'font-semibold text-primary-600' : 'text-neutral-700'}>{format(val)}</span>;
   };
   return (
    <tr className={`${alliance === 'Red' ? 'bg-red-50/30 hover:bg-red-100/40' : 'bg-blue-50/30 hover:bg-blue-100/40'} transition-colors`}>
      <td className="p-2 border-t border-neutral-200 font-medium text-[10px] uppercase tracking-wide text-neutral-600">{alliance}</td>
      <td className="p-2 border-t border-neutral-200 font-semibold text-neutral-800">{team.teamNumber}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.avgAutoScore, 'avgAutoScore')}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.avgTeleopScore, 'avgTeleopScore')}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.avgEndgameScore, 'avgEndgameScore')}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.avgTotalScore, 'avgTotalScore')}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.climbSuccessRate, 'climbSuccessRate', v=>`${v}%`)}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(calculatedMetrics?.consistencyRating, 'consistencyRating')}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(stats?.opr, 'opr', v=>safeNum(v))}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(stats?.dpr, 'dpr', v=>safeNum(v))}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(stats?.ccwm, 'ccwm', v=>safeNum(v))}</td>
      <td className="p-2 border-t border-neutral-200 text-right">{highlight(stats?.defenseRating, 'defenseRating')}</td>
      <td className="p-2 border-t border-neutral-200 text-right capitalize text-neutral-700">{stats?.performanceTrend || '-'}</td>
     </tr>
   );
};

const AllianceSummary: React.FC<{ data: TeamPerformanceData[]; color: 'red' | 'blue' }> = ({ data, color }) => {
  if (!data.length) return <p className="text-xs text-neutral-500">Add team numbers to load metrics.</p>;
  const total = data.reduce((s,t)=> s + t.calculatedMetrics.avgTotalScore, 0);
  const avgClimb = data.reduce((s,t)=> s + t.calculatedMetrics.climbSuccessRate, 0) / data.length || 0;
  const avgConsistency = data.reduce((s,t)=> s + t.calculatedMetrics.consistencyRating, 0) / data.length || 0;
  return (
    <div className={`text-xs rounded-md p-2 ${color === 'red' ? 'bg-red-100/60' : 'bg-blue-100/60'}`}>
      <div className="font-medium mb-1">Summary</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>Total Score: {total.toFixed(1)}</span>
        <span>Avg Climb: {avgClimb.toFixed(1)}%</span>
        <span>Avg Consistency: {avgConsistency.toFixed(1)}/10</span>
      </div>
    </div>
  );
};

export default AllianceComparator;
