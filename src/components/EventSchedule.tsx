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
    const now = new Date();

    const parseTimeToMinutes = (time: string): number | null => {
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        return hours * 60 + minutes;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Find the index of the next upcoming slot (first schedule item after now)
    const upcomingIndex = scheduleData.findIndex((item) => {
        const minutes = parseTimeToMinutes(item.time);
        return minutes !== null && minutes >= currentMinutes;
    });

    return (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden" dir="rtl">
            <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-800">לו&quot;ז היום</h3>
                <span className="text-[11px] text-neutral-400">
                    עודכן אוטומטית לפי השעה הנוכחית
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                    <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                        <th className="py-2 px-3 text-right text-[11px] font-semibold text-neutral-600">זמן</th>
                        <th className="py-2 px-3 text-right text-[11px] font-semibold text-neutral-600">אירוע</th>
                        <th className="py-2 px-3 text-right text-[11px] font-semibold text-neutral-600">מיקום</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scheduleData.map((item, index) => {
                        const isUpcoming = index === upcomingIndex;
                        const isPast = upcomingIndex !== -1 && index < upcomingIndex;

                        return (
                            <tr
                                key={index}
                                className={`border-b border-neutral-100 transition-colors ${
                                    isUpcoming
                                        ? 'bg-amber-50'
                                        : index % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-neutral-50'
                                }`}
                            >
                                <td className="py-2 px-3 text-[11px] text-neutral-800 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        {isUpcoming && (
                                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        )}
                                        <span className={isPast ? 'text-neutral-400 line-through' : ''}>
                                            {item.time}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-2 px-3 text-[11px] text-neutral-800 font-medium">
                                    <span className={isPast ? 'text-neutral-400 line-through' : ''}>
                                        {item.event}
                                    </span>
                                </td>
                                <td className="py-2 px-3 text-[11px] text-neutral-600">
                                    <span className={isPast ? 'text-neutral-400 line-through' : ''}>
                                        {item.location}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventSchedule;