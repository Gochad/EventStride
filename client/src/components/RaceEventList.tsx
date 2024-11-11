import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RaceEvent } from '../types';

const RaceEventList: React.FC = () => {
  const [events, setEvents] = useState<RaceEvent[]>([]);

  useEffect(() => {
    fetchRaceEvents();
  }, []);

  const fetchRaceEvents = async () => {
    try {
      const response = await axios.get('/api/race_events');
      setEvents(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania listy wydarzeń:', error);
    }
  };

  return (
    <div>
      <h2>Lista Wydarzeń Biegowych</h2>
      <Link to="/race_events/new">Dodaj nowe wydarzenie</Link>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/race_events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RaceEventList;
