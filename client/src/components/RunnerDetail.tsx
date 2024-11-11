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
        console.error(error);
      }
    };

    if (id) {
      fetchRunner();
    }
  }, [id]);

  if (!runner) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Runner details</h2>
      <p><strong>Name:</strong> {runner.name}</p>
      <p><strong>Age:</strong> {runner.age}</p>
      <p><strong>Category:</strong> {runner.category}</p>
    </div>
  );
};

export default RunnerDetail;
