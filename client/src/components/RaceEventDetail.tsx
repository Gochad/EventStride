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
        console.error(error);
      }
    };

    if (id) {
      fetchRaceEvent();
    }
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Event details</h2>
      <p><strong>Name:</strong> {event.name}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Distance:</strong> {event.distance} km</p>
      <p><strong>City:</strong> {event.location.city}</p>
      <p><strong>Country:</strong> {event.location.country}</p>
      <p><strong>Route:</strong> {event.track.name}</p>
      <p><strong>Track difficulty level:</strong> {event.track.difficulty_level}</p>
    </div>
  );
};

export default RaceEventDetail;
