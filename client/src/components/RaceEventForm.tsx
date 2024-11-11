import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RaceEventForm: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [trackName, setTrackName] = useState('');
  const [trackDistance, setTrackDistance] = useState<number | ''>('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/race_events', {
        name,
        date,
        distance,
        location: {
          city,
          country,
        },
        track: {
          name: trackName,
          distance: trackDistance,
          difficulty_level: difficultyLevel,
        },
      });
      navigate('/race_events');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add new running event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Distance (km):</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </div>
        <h3>Location info</h3>
        <div>
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>Country:</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <h3>Route</h3>
        <div>
          <label>Name:</label>
          <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} required />
        </div>
        <div>
          <label>Distance (km):</label>
          <input
            type="number"
            value={trackDistance}
            onChange={(e) => setTrackDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </div>
        <div>
          <label>Difficulty level:</label>
          <input type="text" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} required />
        </div>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default RaceEventForm;
