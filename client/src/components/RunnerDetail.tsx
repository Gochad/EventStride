// src/components/RunnerDetail.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Runner } from '../types';
import { useParams } from 'react-router-dom';

const RunnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [runner, setRunner] = useState<Runner | null>(null);

  useEffect(() => {
    const fetchRunner = async () => {
      try {
        const response = await axios.get(`/api/runners/${id}`);
        setRunner(response.data);
      } catch (error) {
        console.error('Error fetching runner data:', error);
      }
    };

    if (id) {
      fetchRunner();
    }
  }, [id]);

  if (!runner) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div>
      <h2>Szczegóły Zawodnika</h2>
      <p><strong>Imię i nazwisko:</strong> {runner.name}</p>
      <p><strong>Wiek:</strong> {runner.age}</p>
      <p><strong>Kategoria:</strong> {runner.category}</p>
    </div>
  );
};

export default RunnerDetail;
