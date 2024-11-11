import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Runner } from '../types';

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      const response = await axios.get('/api/runners');
      setRunners(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Runner list</h2>
      <Link to="/runners/new">Add new runner</Link>
      <ul>
        {runners.map((runner) => (
          <li key={runner.id}>
            <Link to={`/runners/${runner.id}`}>{runner.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RunnerList;
