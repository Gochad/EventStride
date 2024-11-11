import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RaceEvent } from '../types';
import { useParams } from 'react-router-dom';

const RaceEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<RaceEvent | null>(null);

  useEffect(() => {
    const fetchRaceEvent = async () => {
      try {
        const response = await axios.get(`/api/race_events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych wydarzenia:', error);
      }
    };

    if (id) {
      fetchRaceEvent();
    }
  }, [id]);

  if (!event) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h2>Szczegóły Wydarzenia Biegowego</h2>
      <p><strong>Nazwa:</strong> {event.name}</p>
      <p><strong>Data:</strong> {event.date}</p>
      <p><strong>Dystans:</strong> {event.distance} km</p>
      <p><strong>Miasto:</strong> {event.location.city}</p>
      <p><strong>Kraj:</strong> {event.location.country}</p>
      <p><strong>Trasa:</strong> {event.track.name}</p>
      <p><strong>Poziom trudności trasy:</strong> {event.track.difficulty_level}</p>
    </div>
  );
};

export default RaceEventDetail;
