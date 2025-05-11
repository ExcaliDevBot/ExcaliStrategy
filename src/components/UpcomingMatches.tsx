import React from 'react';

interface Match {
  number: number;
  time: string;
  red: string[];
  blue: string[];
  yourTeam: boolean;
}

const matchesData: Match[] = [
  {
    number: 24,
    time: '10:15 AM',
    red: ['1114', '254', '118'],
    blue: ['1678', '2056', '3310'],
    yourTeam: false,
  },
  {
    number: 25,
    time: '10:30 AM',
    red: ['195', '1323', '971'],
    blue: ['2767', '610', '148'],
    yourTeam: true,
  },
  {
    number: 26,
    time: '10:45 AM',
    red: ['1986', '3357', '2481'],
    blue: ['4613', '868', '2791'],
    yourTeam: false,
  },
  {
    number: 27,
    time: '11:00 AM',
    red: ['3478', '5406', '135'],
    blue: ['2056', '973', '4917'],
    yourTeam: false,
  },
];

const UpcomingMatches: React.FC = () => {
  return (
    <div className="space-y-3">
      {matchesData.map((match) => (
        <div 
          key={match.number}
          className={`p-3 rounded-lg border ${
            match.yourTeam 
              ? 'border-secondary-500 bg-secondary-50' 
              : 'border-neutral-200 bg-white'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Match {match.number}</span>
            <span className="text-sm text-neutral-500">{match.time}</span>
          </div>
          
          <div className="flex">
            <div className="w-1/2 pr-2">
              <p className="text-xs text-neutral-500 mb-1">Red Alliance</p>
              <div className="text-sm">
                {match.red.map((team, i) => (
                  <span 
                    key={i} 
                    className={`mr-1 px-1.5 py-0.5 rounded ${
                      team === '148' 
                        ? 'bg-secondary-100 text-secondary-800 font-semibold' 
                        : ''
                    }`}
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-1/2 pl-2">
              <p className="text-xs text-neutral-500 mb-1">Blue Alliance</p>
              <div className="text-sm">
                {match.blue.map((team, i) => (
                  <span 
                    key={i} 
                    className={`mr-1 px-1.5 py-0.5 rounded ${
                      team === '148' 
                        ? 'bg-secondary-100 text-secondary-800 font-semibold' 
                        : ''
                    }`}
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {match.yourTeam && (
            <div className="mt-2 text-xs flex items-center text-secondary-600">
              <span className="w-2 h-2 rounded-full bg-secondary-500 mr-1"></span>
              Your Team's Match
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatches;