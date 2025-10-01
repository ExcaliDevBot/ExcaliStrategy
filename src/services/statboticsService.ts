// Simple Statbotics API integration (approximate mapping to internal TeamPerformanceData)
// Docs: https://api.statbotics.io/
export interface StatboticsTeamEvent {
  team: number;
  event: string;
  epa: number;
  epa_breakdown?: {
    auto?: number;
    teleop?: number;
    endgame?: number;
    total?: number;
  };
  opr?: number;
  dpr?: number;
  ccwm?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  matches?: number;
}

export interface TeamStatsLike {
  performanceTrend: 'upward' | 'stable' | 'downward';
  autoL4: number; autoL3: number; autoL2: number; autoL1: number;
  netScore: number; // using teleop EPA
  processorScore: number; // not available => 0
  climbRate: number; // using endgame EPA scaled
  consistencyRate: number; // placeholder
  defenseRating: number; // unavailable
  matchesPlayed: number;
  opr: number; dpr: number; ccwm: number;
}

export interface TeamPerformanceDataLike {
  teamNumber: number;
  stats: TeamStatsLike;
  calculatedMetrics: {
    avgAutoScore: number;
    avgTeleopScore: number;
    avgEndgameScore: number;
    avgTotalScore: number;
    climbSuccessRate: number;
    consistencyRating: number;
    defenseCapability: string;
  };
  meta?: {
    fallbackUsed: boolean;
    fallbackType?: 'team_year';
    originalEventKey?: string;
    eventExists?: boolean;
    reason?: string;
  };
}

const API_BASE_V2 = 'https://api.statbotics.io/v2';
const API_BASE_V3 = 'https://api.statbotics.io/v3';
// Backwards compatible base used by legacy helpers (will point to v2)
const API_BASE = API_BASE_V2;

interface FetchResult<T> { ok: boolean; status: number; data: T | null; }

async function safeFetchJSON<T>(url: string): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url);
    let data: any = null;
    try { data = await res.clone().json(); } catch { /* ignore parse error */ }
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    console.error('[Statbotics] network error', { url, error: e });
    return { ok: false, status: -1, data: null };
  }
}

async function fetchTeamEventV3(team: number, eventKey: string): Promise<any | null> {
  const url = `${API_BASE_V3}/team_event/${team}/${eventKey}`;
  console.log('[Statbotics] v3 fetchTeamEvent start', { team, eventKey, url });
  const result = await safeFetchJSON<any>(url);
  console.log('[Statbotics] v3 fetchTeamEvent result', result);
  if (!result.ok) return null;
  return result.data;
}

async function fetchTeamEventV2(team: number, eventKey: string): Promise<StatboticsTeamEvent | null> {
  const url = `${API_BASE_V2}/team_event/${team}/${eventKey}`;
  console.log('[Statbotics] v2 fetchTeamEvent start', { team, eventKey, url });
  const result = await safeFetchJSON<StatboticsTeamEvent>(url);
  console.log('[Statbotics] v2 fetchTeamEvent result', result);
  if (!result.ok) return null;
  return result.data;
}

async function fetchTeamEvent(team: number, eventKey: string): Promise<{ version:'v3'|'v2'; raw:any } | null> {
  const v3 = await fetchTeamEventV3(team, eventKey);
  if (v3) return { version: 'v3', raw: v3 };
  const v2 = await fetchTeamEventV2(team, eventKey);
  if (v2) return { version: 'v2', raw: v2 };
  return null;
}

async function fetchTeamYear(team: number, year: number): Promise<StatboticsTeamEvent | null> {
   // team_year returns aggregated EPA; we coerce into similar shape
  const url = `${API_BASE_V2}/team_year/${team}/${year}`; // v3 analog not required here
  console.log('[Statbotics] fetchTeamYear start', { team, year, url });
  const result = await safeFetchJSON<any>(url);
  console.log('[Statbotics] fetchTeamYear result', result);
  if (!result.ok || !result.data) return null;
  const d = result.data;
  return {
    team,
    event: `${year}`,
    epa: d.epa ?? 0,
    epa_breakdown: {
      auto: d.auto_epa ?? d.epa_breakdown?.auto ?? 0,
      teleop: d.teleop_epa ?? d.epa_breakdown?.teleop ?? 0,
      endgame: d.endgame_epa ?? d.epa_breakdown?.endgame ?? 0,
      total: d.epa ?? d.epa_breakdown?.total ?? 0,
    },
    opr: d.opr,
    dpr: d.dpr,
    ccwm: d.ccwm,
    wins: d.wins,
    losses: d.losses,
    ties: d.ties,
    matches: d.matches_played || d.matches || 0
  };
}

async function eventExists(eventKey: string): Promise<boolean> {
  const url = `${API_BASE_V2}/event/${eventKey}`; // v3 compatibility not needed for existence check
  const result = await safeFetchJSON<any>(url);
  console.log('[Statbotics] eventExists check', { eventKey, status: result.status, ok: result.ok });
  return result.ok && !!result.data;
}

function deriveTrend(previous: number[], current: number): 'upward' | 'stable' | 'downward' {
  if (!previous.length) return 'stable';
  const avgPrev = previous.reduce((a,b)=>a+b,0)/previous.length;
  if (current > avgPrev * 1.05) return 'upward';
  if (current < avgPrev * 0.95) return 'downward';
  return 'stable';
}

export async function getStatboticsTeamPerformance(team: number, eventKey: string): Promise<TeamPerformanceDataLike | null> {
  console.log('[Statbotics] getStatboticsTeamPerformance (v3 preferred) called', { team, eventKey });
  const yrMatch = eventKey.match(/^(\d{4})/);
  const year = yrMatch ? parseInt(yrMatch[1], 10) : new Date().getFullYear();
  let eventExistsFlag: boolean | undefined;
  let reason: string | undefined;
  let fallbackUsed = false;

  const fetched = await fetchTeamEvent(team, eventKey); // tries v3 then v2
  let versionUsed: 'v3' | 'v2' | 'year-fallback' | 'none' = 'none';
  let raw = fetched?.raw;
  if (fetched) versionUsed = fetched.version;

  if (!raw) {
    eventExistsFlag = await eventExists(eventKey);
    console.warn('[Statbotics] no team_event data (v3/v2), attempting year aggregate', { eventKey, eventExistsFlag });
    raw = await fetchTeamYear(team, year);
    if (!raw) {
      reason = `No team_event or year data available for team ${team} (${eventKey}).`;
      console.log('[Statbotics] ultimate failure', { reason });
      return null;
    }
    versionUsed = 'year-fallback';
    fallbackUsed = true;
    reason = `Using season aggregate (team_year) because no team_event data for ${eventKey}.`;
  }

  // Normalize v3 or fallback structure into breakdown numbers
  let autoPoints = 0, teleopPoints = 0, endgamePoints = 0, totalPoints = 0, matchesPlayed = 0, opr = 0, dpr = 0, ccwm = 0;
  if (versionUsed === 'v3' && raw?.epa?.breakdown) {
    autoPoints = raw.epa.breakdown.auto_points ?? raw.epa.breakdown.auto ?? 0;
    teleopPoints = raw.epa.breakdown.teleop_points ?? raw.epa.breakdown.teleop ?? 0;
    endgamePoints = raw.epa.breakdown.endgame_points ?? raw.epa.breakdown.endgame ?? 0;
    totalPoints = raw.epa.breakdown.total_points ?? (autoPoints + teleopPoints + endgamePoints);
    matchesPlayed = raw.record?.qual?.wins !== undefined ? (raw.record.qual.wins + raw.record.qual.losses + (raw.record.qual.ties || 0)) : (raw.matches || 0);
    opr = totalPoints;
    dpr = (raw.epa?.stats?.mean ?? totalPoints) * 0.4;
    ccwm = opr - dpr;
  } else if (versionUsed === 'v2' && raw?.epa_breakdown) {
    autoPoints = raw.epa_breakdown.auto ?? 0;
    teleopPoints = raw.epa_breakdown.teleop ?? 0;
    endgamePoints = raw.epa_breakdown.endgame ?? 0;
    totalPoints = raw.epa_breakdown.total ?? (autoPoints + teleopPoints + endgamePoints);
    matchesPlayed = raw.matches || 0;
    opr = raw.opr ?? totalPoints;
    dpr = raw.dpr ?? 0;
    ccwm = raw.ccwm ?? (opr - dpr);
  } else {
    // year fallback aggregated object
    autoPoints = raw.epa_breakdown?.auto ?? raw.auto_epa ?? 0;
    teleopPoints = raw.epa_breakdown?.teleop ?? raw.teleop_epa ?? 0;
    endgamePoints = raw.epa_breakdown?.endgame ?? raw.endgame_epa ?? 0;
    totalPoints = raw.epa_breakdown?.total ?? raw.epa ?? (autoPoints + teleopPoints + endgamePoints);
    matchesPlayed = raw.matches || raw.matches_played || 0;
    opr = raw.opr ?? totalPoints;
    dpr = raw.dpr ?? 0;
    ccwm = raw.ccwm ?? (opr - dpr);
  }

  console.log('[Statbotics] normalized values', { versionUsed, autoPoints, teleopPoints, endgamePoints, totalPoints, matchesPlayed, opr, dpr, ccwm, fallbackUsed, reason });

  const stats: TeamStatsLike = {
    performanceTrend: deriveTrend([], totalPoints),
    autoL4: 0, autoL3: 0, autoL2: 0, autoL1: 0,
    netScore: teleopPoints,
    processorScore: 0,
    climbRate: endgamePoints * 10,
    consistencyRate: 0,
    defenseRating: 0,
    matchesPlayed,
    opr, dpr, ccwm,
  };

  const calculated = {
    avgAutoScore: Math.round(autoPoints),
    avgTeleopScore: Math.round(teleopPoints),
    avgEndgameScore: Math.round(endgamePoints),
    avgTotalScore: Math.round(totalPoints),
    climbSuccessRate: Math.round(stats.climbRate),
    consistencyRating: Math.round(stats.consistencyRate)/10,
    defenseCapability: 'N/A',
  };

  return { teamNumber: team, stats, calculatedMetrics: calculated, meta: { fallbackUsed, fallbackType: fallbackUsed ? 'team_year' : undefined, originalEventKey: eventKey, eventExists: eventExistsFlag, reason } };
}

// Reinstate matches function if truncated
export interface StatboticsMatch { match: string; epa_breakdown?: { auto?: number; teleop?: number; endgame?: number; total?: number }; }
export async function getStatboticsTeamEventMatches(team: number, eventKey: string): Promise<StatboticsMatch[]> {
  let url = `${API_BASE_V3}/team_event_matches/${team}/${eventKey}`;
  console.log('[Statbotics] getStatboticsTeamEventMatches start', { team, eventKey, url });
  try {
    const res = await fetch(url);
    console.log('[Statbotics] getStatboticsTeamEventMatches response', { status: res.status, ok: res.ok });
    if (!res.ok) {
      url = `${API_BASE_V2}/team_event_matches/${team}/${eventKey}`;
      console.log('[Statbotics] retrying matches on v2', { url });
      const res2 = await fetch(url);
      console.log('[Statbotics] v2 matches response', { status: res2.status, ok: res2.ok });
      if (!res2.ok) return [];
      const data2 = await res2.json();
      console.log('[Statbotics] v2 matches json length', Array.isArray(data2) ? data2.length : 'not-array');
      if (!Array.isArray(data2)) return [];
      return data2 as StatboticsMatch[];
    }
    const data = await res.json();
    console.log('[Statbotics] getStatboticsTeamEventMatches json length', Array.isArray(data) ? data.length : 'not-array');
    if (!Array.isArray(data)) return [];
    return data as StatboticsMatch[];
  } catch (e) {
    console.warn('[Statbotics] match fetch failed', { team, eventKey, error: e });
    return [];
  }
}
