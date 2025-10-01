// File: `src/pages/PitScouting.tsx`
import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {initializeApp, getApps} from 'firebase/app';
import {getDatabase, ref, get} from 'firebase/database';

type MappedAnswer = {
    id: string;
    label: string;
    type: string;
    value: string | number | boolean | null;
};

type MappedPitNode = {
    id?: string;
    scout?: string;
    timestamp?: string;
    answers: MappedAnswer[];
};

type RawPitNode = {
    scout?: string;
    timestamp?: string;
    answers?: Record<string, string>;
};

const QUESTIONS: Record<string, { label: string; type: string; options: string[] }> = {
    "0": {"label": "האם הרובוט יכול לטפס לגבוה", "type": "toggle", "options": ["yes", "no"]},
    "1": {"label": "האם הרובוט יכול לטפס לנמוך", "type": "toggle", "options": ["yes", "no"]},
    "2": {"label": "האם הרובוט מסוגל לנקד ב L1", "type": "toggle", "options": ["yes", "no"]},
    "3": {"label": "האם הרובוט מסוגל לנקד בL2", "type": "toggle", "options": ["yes", "no"]},
    "4": {"label": "האם הרובוט מסוגל לנקד ב L3", "type": "toggle", "options": ["yes", "no"]},
    "5": {"label": "האם הרובוט מסוגל לנקד בL4", "type": "toggle", "options": ["yes", "no"]},
    "6": {"label": "האם הרובוט מסוגל לאסוף מהרצפה", "type": "toggle", "options": ["yes", "no"]},
    "7": {"label": "האם הרובוט מסוגל לאסוף מהפידר", "type": "toggle", "options": ["yes", "no"]},
    "8": {"label": "האם הרובוט מסוגל לנקד Algae בפרוססור", "type": "toggle", "options": ["yes", "no"]},
    "9": {"label": "האם הרובוט מסוגל לנקד Algae ברשת", "type": "toggle", "options": ["yes", "no"]},
    "13": {"label": "הערות כלליות אחרות", "type": "multiline", "options": []},
    "14": {"label": "משקל הרובוט (ק\\\"ג)", "type": "number", "options": []},
    "15": {"label": "מנועי הנעה (סוורב)", "type": "text", "options": []},
    "16": {"label": "מנועי סיבוב (סוורב)", "type": "text", "options": []},
    "17": {"label": "גודל מרכב (מטר, עשרוני)", "type": "number", "options": []},
    "18": {"label": "המרה בסוורב", "type": "text", "options": []},
    "19": {"label": "שניות לנקד ל-L4", "type": "number", "options": []},
    "20": {"label": "סייקלים ממוצע למקצה", "type": "number", "options": []},
    "21": {"label": "האם האיסוף מהפידר דורש דיוק כמו של 2230/2231?", "type": "toggle", "options": ["yes", "no"]},
    "22": {"label": "האם האיסוף מהפידר מתנדנד כמו הרובוט שלנו בעונה?", "type": "toggle", "options": ["yes", "no"]},
    "23": {"label": "האם האיסוף מהרצפה בגודל מרכב או פחות?", "type": "toggle", "options": ["yes", "no"]}
};

function parseValue(raw: string | undefined, type: string) {
    if (raw == null) return null;
    if (type === 'number') {
        const n = Number(raw);
        return Number.isNaN(n) ? null : n;
    }
    if (type === 'toggle') {
        return String(raw).toLowerCase() === 'yes';
    }
    return raw;
}

function mapPitNode(node: RawPitNode | undefined, questions: typeof QUESTIONS, id?: string): MappedPitNode {
    const answers: MappedAnswer[] = [];
    const rawAnswers: Record<string, string> = node?.answers || {};
    for (const qid of Object.keys(questions)) {
        const qmeta = questions[qid];
        const raw = rawAnswers[qid];
        answers.push({
            id: qid,
            label: qmeta.label,
            type: qmeta.type,
            value: parseValue(raw, qmeta.type)
        });
    }
    for (const [qid, raw] of Object.entries(rawAnswers)) {
        if (!questions[qid]) {
            answers.push({
                id: qid,
                label: qid,
                type: 'text',
                value: raw
            });
        }
    }
    return {
        id,
        scout: node?.scout,
        timestamp: node?.timestamp,
        answers
    };
}

// Initialize Firebase client app if not already initialized
if (!getApps().length) {
    initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
    });
}

// --- TBA helpers (improved) ---
const tbaCache = new Map<string, { nickname?: string; logoUrl?: string } | null>();

async function fetchTbaTeam(teamCandidate: string | number | undefined) {
    if (!teamCandidate && teamCandidate !== 0) return null;
    const digits = String(teamCandidate).match(/\d+/);
    if (!digits) return null;
    const tn = digits[0];
    const key = `frc${tn}`;
    if (tbaCache.has(key)) return tbaCache.get(key) ?? null;

    const apiKey = "DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO";
    if (!apiKey) {
        tbaCache.set(key, null);
        return null;
    }

    try {
        const base = 'https://www.thebluealliance.com/api/v3';
        const headers = {'X-TBA-Auth-Key': apiKey};

        const teamRes = await fetch(`${base}/team/${key}`, {headers}).catch(() => null);
        const teamJson = teamRes && teamRes.ok ? await teamRes.json() : null;
        const nickname = teamJson?.nickname || teamJson?.team_name;

        const mediaRes = await fetch(`${base}/team/${key}/media`, {headers}).catch(() => null);
        const mediaJson = mediaRes && mediaRes.ok ? await mediaRes.json() : null;

        let logoUrl: string | undefined;
        if (Array.isArray(mediaJson)) {
            for (const m of mediaJson) {
                if (!m) continue;
                const candidates: unknown[] = [
                    m.details?.direct_url,
                    m.direct_url,
                    m.details?.secure_url,
                    m.previews?.default,
                    m.previews?.small,
                    m.previews?.thumb
                ];
                for (const c of candidates) {
                    if (typeof c === 'string' && /\.(png|jpe?g|svg|webp)(\?.*)?$/.test(c)) {
                        logoUrl = c;
                        break;
                    }
                }
                if (logoUrl) break;
                if (m.type === 'photo' && typeof m.direct_url === 'string') {
                    logoUrl = m.direct_url;
                    break;
                }
            }
        }

        // Fallback: use TheBlueAlliance avatar pattern for 2025 if no media logo found
        if (!logoUrl) {
            logoUrl = `https://www.thebluealliance.com/avatar/2025/frc${tn}.png`;
        }

        const result = {nickname: nickname || undefined, logoUrl};
        tbaCache.set(key, result);
        return result;
    } catch {
        tbaCache.set(key, null);
        return null;
    }
}

function formatValue(a: MappedAnswer) {
    if (a.type === 'toggle') return a.value ? 'Yes' : 'No';
    if (a.type === 'number' && typeof a.value === 'number') return a.value;
    if (a.type === 'multiline' && typeof a.value === 'string') {
        const s = a.value;
        return s.length > 160 ? `${s.slice(0, 160)}…` : s;
    }
    return a.value ?? '—';
}

const Badge: React.FC<{ on: boolean | null; label?: string }> = ({on, label}) => (
    <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${on ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {label ?? (on ? 'Yes' : 'No')}
  </span>
);

const PitScouting: React.FC = () => {
    const [pitNodes, setPitNodes] = useState<MappedPitNode[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchPit() {
            try {
                const db = getDatabase();
                const snapshot = await get(ref(db, 'pitScouting'));
                const data = (snapshot.val() || {}) as Record<string, RawPitNode>;
                const nodes: MappedPitNode[] = Object.entries(data).map(([id, raw]) =>
                    mapPitNode(raw, QUESTIONS, id)
                );
                if (mounted) {
                    setPitNodes(nodes);
                    setLoading(false);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                if (mounted) {
                    setError(message || 'Failed to load pit data');
                    setLoading(false);
                }
            }
        }

        fetchPit();
        return () => {
            mounted = false;
        };
    }, []);

    // decorate with TBA info
    const [decorated, setDecorated] = useState<Record<string, { nickname?: string; logoUrl?: string } | null>>({});
    useEffect(() => {
        let mounted = true;

        async function decorate() {
            if (!pitNodes) return;
            const result: Record<string, { nickname?: string; logoUrl?: string } | null> = {};
            await Promise.all(pitNodes.map(async (node) => {
                const candidateId = node.id ?? '';
                // robust team-number detection:
                // 1. if id is pure digits -> use it
                // 2. else look for answers that likely contain team number
                // 3. else try node.id as-is (may be 'frc1234')
                let teamCandidate: string | number | undefined = undefined;
                if (/^\d+$/.test(candidateId)) {
                    teamCandidate = candidateId;
                } else {
                    // common answer keys that could contain team number
                    const possible = node.answers.find(a => /team(_?number)?|teamId|team id|team number/i.test(a.id) || /team(_?number)?|team id|team number/i.test(a.label));
                    if (possible && (typeof possible.value === 'string' || typeof possible.value === 'number')) {
                        teamCandidate = possible.value;
                    } else {
                        teamCandidate = candidateId;
                    }
                }
                const info = await fetchTbaTeam(teamCandidate);
                result[candidateId] = info ?? null;
            }));
            if (mounted) setDecorated(result);
        }

        decorate();
        return () => {
            mounted = false;
        };
    }, [pitNodes]);

    // per-card expanded state
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    function toggleExpanded(id: string | undefined) {
        if (!id) return;
        setExpanded(prev => ({...prev, [id]: !prev[id]}));
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Pit Scouting</h1>
                    <p className="text-neutral-500">Collect data about teams and their robots</p>
                </div>
                <button
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center">
                    <Plus size={16} className="mr-2"/>
                    New Team
                </button>
            </div>

            {loading && <p className="text-neutral-500">Loading pit scouting data...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {pitNodes && pitNodes.length === 0 && (
                    <div className="p-6 bg-neutral-50 rounded-md">No pit nodes found.</div>
                )}
                {pitNodes && pitNodes.map((node) => {
                    const dec = decorated[node.id ?? ''] || null;
                    const teamNumberDisplay = node.id ?? '—';
                    const nickname = dec?.nickname ?? 'Unknown';
                    const logo = dec?.logoUrl;
                    const isExpanded = !!expanded[node.id ?? ''];
                    // pick a few highlight answers
                    const highlights = ['14', '17', '19', '20', '6', '7', '21', '22', '23'];

                    return (
                        <div key={node.id} className="p-4 bg-white border rounded-lg shadow-md">
                            <div className="flex items-center gap-4 mb-3">
                                <div
                                    className="w-20 h-20 rounded-md bg-neutral-100 overflow-hidden flex items-center justify-center border">
                                    {logo ? (
                                        <img src={logo} alt={`${teamNumberDisplay} logo`}
                                             className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="text-sm text-neutral-500">{teamNumberDisplay}</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-neutral-500">Team</div>
                                            <div
                                                className="text-lg font-semibold">{teamNumberDisplay} · {nickname}</div>
                                        </div>
                                        <div
                                            className="text-xs text-neutral-400">{node.timestamp ? new Date(node.timestamp).toLocaleString() : '—'}</div>
                                    </div>
                                    <div className="mt-2 text-xs text-neutral-600">Scout: {node.scout ?? '—'}</div>
                                </div>
                            </div>

                            {!isExpanded && (
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {highlights.map((qid) => {
                                        const a = node.answers.find(x => x.id === qid);
                                        if (!a) return null;
                                        if (a.type === 'toggle') {
                                            return (
                                                <div key={qid}
                                                     className="flex items-center justify-between bg-neutral-50 p-2 rounded-md">
                                                    <div className="text-xs text-neutral-600">{a.label}</div>
                                                    <Badge on={a.value as boolean | null}/>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={qid} className="flex flex-col bg-neutral-50 p-2 rounded-md">
                                                <div className="text-xs text-neutral-600">{a.label}</div>
                                                <div className="font-medium">{formatValue(a)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {isExpanded && (
                                <div className="mb-3">
                                    <div className="text-xs text-neutral-500 mb-1">All answers</div>
                                    <div className="space-y-1 text-sm">
                                        {node.answers.map((a) => (
                                            <div key={a.id} className="flex justify-between border-b pb-1">
                                                <div className="text-neutral-600">{a.label}</div>
                                                <div
                                                    className="font-medium">{a.type === 'toggle' ? ((a.value as boolean) ? 'Yes' : 'No') : (a.value ?? '—')}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3 text-xs text-neutral-500">Raw data</div>
                                    <pre className="mt-1 p-2 bg-neutral-100 rounded text-xs overflow-auto"
                                         style={{maxHeight: 240}}>
                    {JSON.stringify(node, null, 2)}
                  </pre>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => toggleExpanded(node.id)}
                                    className="text-sm text-primary-600 hover:underline"
                                >
                                    {isExpanded ? 'Show less' : 'More'}
                                </button>

                                <div className="text-xs text-neutral-500">
                                    {dec === null ? 'TBA: unknown / API key not set' : (dec.nickname ? 'TBA: OK' : 'TBA: no data')}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PitScouting;