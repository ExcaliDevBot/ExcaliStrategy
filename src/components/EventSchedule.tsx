import React from 'react';

const scheduleData = [
  { time: '08:00 AM', event: 'Team Check-in', location: 'Main Entrance' },
  { time: '09:00 AM', event: 'Opening Ceremonies', location: 'Main Arena' },
  { time: '09:30 AM', event: 'Qualification Matches Begin', location: 'Competition Field' },
  { time: '12:00 PM', event: 'Lunch Break', location: 'Cafeteria' },
  { time: '01:00 PM', event: 'Qualification Matches Resume', location: 'Competition Field' },
  { time: '04:30 PM', event: 'Alliance Selection', location: 'Main Arena' },
  { time: '05:00 PM', event: 'Playoff Matches', location: 'Competition Field' },
  { time: '07:00 PM', event: 'Awards Ceremony', location: 'Main Arena' },
];

const EventSchedule: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-600">Time</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-600">Event</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-neutral-600">Location</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((item, index) => (
            <tr 
              key={index} 
              className={`border-b border-neutral-100 ${
                index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
              }`}
            >
              <td className="py-3 px-4 text-sm text-neutral-800">{item.time}</td>
              <td className="py-3 px-4 text-sm text-neutral-800 font-medium">{item.event}</td>
              <td className="py-3 px-4 text-sm text-neutral-600">{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventSchedule;