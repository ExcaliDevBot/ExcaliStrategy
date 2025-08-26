export interface EventTeam {
  teamNumber: number;
  teamName: string;
}

// NOTE: For production move API key to secure backend / env variable.
const TBA_API_KEY = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

interface TBATeamRaw {
  team_number: number;
  nickname: string | null;
}

export async function fetchEventTeams(eventKey?: string): Promise<EventTeam[]> {
  const key = eventKey || localStorage.getItem('eventKey') || '2025iscmp';
  try {
    const resp = await fetch(`https://www.thebluealliance.com/api/v3/event/${key}/teams`, {
      headers: { 'X-TBA-Auth-Key': TBA_API_KEY }
    });
    if (!resp.ok) {
      console.warn('Failed to fetch teams, status', resp.status);
      return [];
    }
    const data: TBATeamRaw[] = await resp.json();
    return (data || []).map((t) => ({
      teamNumber: t.team_number,
      teamName: t.team_number === 6738 ? 'Our Team' : t.nickname || 'Unknown Team'
    })).sort((a, b) => a.teamNumber - b.teamNumber);
  } catch (e) {
    console.error('fetchEventTeams error', e);
    return [];
  }
}
