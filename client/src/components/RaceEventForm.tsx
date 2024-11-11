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
      console.error('Błąd podczas dodawania wydarzenia:', error);
    }
  };

  return (
    <div>
      <h2>Dodaj Nowe Wydarzenie Biegowe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Data:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Dystans (km):</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </div>
        <h3>Informacje o lokalizacji</h3>
        <div>
          <label>Miasto:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div>
          <label>Kraj:</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <h3>Informacje o trasie</h3>
        <div>
          <label>Nazwa trasy:</label>
          <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} required />
        </div>
        <div>
          <label>Dystans trasy (km):</label>
          <input
            type="number"
            value={trackDistance}
            onChange={(e) => setTrackDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </div>
        <div>
          <label>Poziom trudności:</label>
          <input type="text" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} required />
        </div>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default RaceEventForm;
