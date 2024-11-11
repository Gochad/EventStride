import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { RaceEvent } from '../types';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
} from '@mui/material';

const RaceEventList: React.FC = () => {
  const [events, setEvents] = useState<RaceEvent[]>([]);

  useEffect(() => {
    fetchRaceEvents();
  }, []);

  const fetchRaceEvents = async () => {
    try {
      const response = await api.get('/race_events');
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        List of Running Events
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/race_events/new" 
        sx={{ marginBottom: 2 }}
      >
        Add New Event
      </Button>
      <List>
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <ListItem button component={Link} to={`/race_events/${event.id}`}>
              <ListItemText primary={event.name} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default RaceEventList;
