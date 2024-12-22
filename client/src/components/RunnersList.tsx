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
import { fetchRunners, fetchEvents, makeAdmin } from '../services/api.tsx';

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [selectedRunner, setSelectedRunner] = useState<number | null>(null);
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

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Runner List
      </Typography>
      <List>
        {runners.map((runner) => (
          <ListItem key={runner.id}>
            <Box display="flex" flexDirection="column" width="100%">
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Link to={`/runners/${runner.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                  <ListItemText primary={runner.name} />
                </Link>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => makeAdmin(runner.id)}
                >
                  Make Admin
                </Button>
              </Box>
              {selectedRunner === runner.id && (
                <Box mt={2}>
                  <Select
                    value={selectedEvent || ''}
                    onChange={(e) => setSelectedEvent(Number(e.target.value))}
                    displayEmpty
                    fullWidth
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
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RunnerList;
