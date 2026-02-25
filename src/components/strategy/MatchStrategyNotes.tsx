import React from 'react';

const mockStrategy = {
  matchNumber: 24,
  matchType: 'qualification',
  allianceColor: 'red',
  alliance: ['148', '254', '118'],
  opponents: ['1114', '2056', '1678'],
  gameplan: 'Play clean, high-percentage cycles. Protect our scorer, contest center game pieces, and avoid penalties.',
  autoStrategy: '148: preload + exit. 254: two game pieces. 118: one piece + light disruption.',
  teleopStrategy: '148 & 254 focus on fast cycles. 118 flexes between scoring and light defense based on score.',
  endgameStrategy: 'Aim for two reliable climbs; third climbs only if time and position are safe.',
  defensiveStrategy: 'Disrupt their top scorer when we are ahead, otherwise prioritize our own scoring.',
  backupPlans: 'If a robot is down, shift to safe cycles and avoid congestion. If we fall behind, reduce defense and maximize scoring.',
  notes: 'Watch for fouls in the loading zone. Keep clear comms and call score gaps every 15–20 seconds.',
};

const MatchStrategyNotes: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">
          Match {mockStrategy.matchNumber}
        </h3>
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          {mockStrategy.matchType} · {mockStrategy.allianceColor.toUpperCase()} alliance
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-700">
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-neutral-500 mb-0.5">Alliance</div>
          <div className="font-medium">{mockStrategy.alliance.join(' · ')}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-neutral-500 mb-0.5">Opponents</div>
          <div className="font-medium">{mockStrategy.opponents.join(' · ')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-800">
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Game plan</div>
          <p>{mockStrategy.gameplan}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Auto</div>
          <p className="whitespace-pre-line">{mockStrategy.autoStrategy}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Teleop</div>
          <p className="whitespace-pre-line">{mockStrategy.teleopStrategy}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2 space-y-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Endgame</div>
            <p className="whitespace-pre-line">{mockStrategy.endgameStrategy}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Defense</div>
            <p className="whitespace-pre-line">{mockStrategy.defensiveStrategy}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-800">
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Backup</div>
          <p>{mockStrategy.backupPlans}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-md px-3 py-2">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Notes</div>
          <p>{mockStrategy.notes}</p>
        </div>
      </div>
    </div>
  );
};

export default MatchStrategyNotes;