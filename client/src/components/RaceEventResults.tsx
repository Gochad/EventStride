import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Result } from '../types';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Box, 
  CircularProgress 
} from '@mui/material';

interface ResultsResponse {
  race_event: string;
  results: Result[];
}

const RaceEventResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<Result[]>([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get<ResultsResponse>(`/race_events/${id}/results`);
        setResults(response.data.results);
        setEventName(response.data.race_event);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Wyniki Wydarzenia: {eventName}
      </Typography>
      <List>
        {results.map((result, index) => (
          <React.Fragment key={result.runner_id}>
            <ListItem>
              <ListItemText
                primary={`${result.position}. ${result.runner_name}`}
                secondary={`Czas ukończenia: ${result.finish_time}`}
              />
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default RaceEventResults;
