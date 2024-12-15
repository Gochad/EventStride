import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RaceEvent, Runner } from '../types';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Select, 
  MenuItem, 
  Box 
} from '@mui/material';
import { fetchRunners, fetchEvents, assignRunnerToEvent } from '../services/api.tsx';

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    const loadRunnersAndEvents = async () => {
      try {
        const runnersData = await fetchRunners();
        setRunners(runnersData);

        const eventsData = await fetchEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadRunnersAndEvents();
  }, []);

  const handleAssignEvent = async (runnerId: number) => {
    if (!selectedEvent) {
      alert('Please select an event.');
      return;
    }

    try {
      await assignRunnerToEvent(runnerId, selectedEvent);
      alert('Runner assigned to event successfully.');
    } catch (error) {
      console.error('Error assigning runner to event:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Runner List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/runners/new"
        sx={{ marginBottom: 2 }}
      >
        Add New Runner
      </Button>
      <Select
        value={selectedEvent || ''}
        onChange={(e) => setSelectedEvent(Number(e.target.value))}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="" disabled>
          Select an Event
        </MenuItem>
        {events.map((event: RaceEvent) => (
          <MenuItem key={event.id} value={event.id}>
            {event.name} ({new Date(event.date).toLocaleDateString()})
          </MenuItem>
        ))}
      </Select>
      <List>
        {runners.map((runner) => (
          <ListItem key={runner.id}>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
              <Link to={`/runners/${runner.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                <ListItemText primary={runner.name} />
              </Link>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleAssignEvent(runner.id)}
              >
                Assign to Event
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RunnerList;
