import React from 'react';

const scheduleData = [
    {time: '07:00', event: 'כניסה להיכל והתמקמות', location: 'כניסה ראשית'},
    {time: '07:30', event: 'שחרית מניין ב\'', location: 'רחבה חיצונית לאולם'},
    {time: '8:30', event: ' שיחת קבוצה וארוחת בוקר', location: '---'},
    {time: '9:00', event: 'תחילת מקצי דירוג', location: 'מגרש התחרות'},
    {time: '10:30', event: 'טקס פתיחה', location: 'יציע'},
    {time: '10:45', event: 'חידוש משחקי דירוג', location: 'מגרש התחרות'},
    {time: '13:00', event: 'הפסקת צהריים', location: '---'},
    {time: '13:45', event: 'חידוש משחקי דירוג', location: 'מגרש התחרות'},
    {time: '18:00', event: 'סגירת ההיכל', location: 'רחבה חיצונית'},
    {time: '20:00', event: ' חזרה משוערת למודיעין', location: 'הסדנא'},
];

const EventSchedule: React.FC = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full" dir="rtl">
                <thead>
                <tr className="border-b border-neutral-200">
                    <th className="py-3 px-4 text-right text-sm font-semibold text-neutral-600">זמן</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-neutral-600">אירוע</th>
                    <th className="py-3 px-4 text-right text-sm font-semibold text-neutral-600">מיקום</th>
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