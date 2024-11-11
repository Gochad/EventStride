import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RunnerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/runners', { name, age, category });
      navigate('/runners');
    } catch (error) {
      console.error('Błąd podczas dodawania zawodnika:', error);
    }
  };

  return (
    <div>
      <h2>Dodaj Nowego Zawodnika</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Imię i nazwisko:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Wiek:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </div>
        <div>
          <label>Kategoria:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default RunnerForm;
