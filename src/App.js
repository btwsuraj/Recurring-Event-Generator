import React, { useState } from 'react';
import { format, addDays, isWithinInterval, parseISO, getDay, set } from 'date-fns';

export default function RecurringEventGenerator() {
  const [startDate, setStartDate] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [occurrences, setOccurrences] = useState(5);
  const [eventTime, setEventTime] = useState('09:00');
  const [viewStart, setViewStart] = useState('');
  const [viewEnd, setViewEnd] = useState('');
  const [instances, setInstances] = useState([]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const generateInstances = () => {
    if (!startDate || !viewStart || !viewEnd) return;

    const start = parseISO(startDate);
    const viewWindow = {
      start: parseISO(viewStart),
      end: parseISO(viewEnd),
    };

    let results = [];
    let currentDate = start;
    let count = 0;

    while (count < occurrences) {
      let eventDate;

      if (recurrenceType === 'daily') {
        eventDate = addDays(start, count);
      } else {
        const desiredDay = daysOfWeek.indexOf(dayOfWeek);
        const currentDay = getDay(currentDate);
        let offset = (desiredDay - currentDay + 7) % 7;
        if (offset === 0 && count > 0) offset = 7;
        eventDate = addDays(currentDate, offset);
        currentDate = addDays(eventDate, 1);
      }

      // Apply time to date
      const [hours, minutes] = eventTime.split(':').map(Number);
      const finalDate = set(eventDate, { hours, minutes });

      results.push(finalDate);
      count++;
      if (recurrenceType === 'daily') {
        currentDate = addDays(eventDate, 1);
      }
    }

    setInstances(results);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Recurring Event Generator</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Start Date:<br />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Recurrence Type:<br />
          <select value={recurrenceType} onChange={(e) => setRecurrenceType(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>

      {recurrenceType === 'weekly' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Day of the Week:<br />
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div style={{ marginBottom: '10px' }}>
        <label>Number of Occurrences:<br />
          <input type="number" value={occurrences} onChange={(e) => setOccurrences(Number(e.target.value))} />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Event Time:<br />
          <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>View Start Date:<br />
          <input type="date" value={viewStart} onChange={(e) => setViewStart(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>View End Date:<br />
          <input type="date" value={viewEnd} onChange={(e) => setViewEnd(e.target.value)} />
        </label>
      </div>

      <button onClick={generateInstances} style={{ padding: '8px 16px', marginTop: '10px' }}>
        Generate Instances
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Generated Event Instances:</h3>
        <ul>
          {instances.map((date, idx) => {
            const isVisible = isWithinInterval(date, {
              start: parseISO(viewStart),
              end: parseISO(viewEnd),
            });
            return (
              <li key={idx} style={{ color: isVisible ? 'black' : 'gray' }}>
                {format(date, 'yyyy-MM-dd HH:mm')}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
