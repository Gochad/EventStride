import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Result } from '../types';
import { useParams } from 'react-router-dom';

interface ResultsResponse {
  race_event: string;
  results: Result[];
}

const RaceEventResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<Result[]>([]);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get<ResultsResponse>(`/api/race_events/${id}/results`);
        setResults(response.data.results);
        setEventName(response.data.race_event);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  return (
    <div>
      <h2>Wyniki Wydarzenia: {eventName}</h2>
      <ul>
        {results.map((result) => (
          <li key={result.runner_id}>
            {result.position}. {result.runner_name} - {result.finish_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RaceEventResults;
