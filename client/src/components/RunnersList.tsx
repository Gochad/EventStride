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
import { fetchRunners, fetchEvents } from '../services/api.tsx';
import { createPaymentLink } from '../services/payments.tsx';

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

  const handleAssignEvent = async (runner: Runner) => {
    if (!selectedEvent) {
      alert('Please select an event.');
      return;
    }
  
    const selectedEventData = events.find(event => event.id === selectedEvent);
  
    if (!selectedEventData) {
      alert('Invalid event selected.');
      return;
    }
  
    try {
      const paymentData = {
        success_url: `${window.location.origin}`,
        cancel_url: `${window.location.origin}`,
        unit_amount: 200,
        runner_name: runner.name,
        event_name: selectedEventData.name,
      };
  
      const response = await createPaymentLink(paymentData);
      const paymentUrl = response.url;
  
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert('Failed to create payment link. Please try again.');
    }
  };

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
                  color="secondary"
                  onClick={() => setSelectedRunner(runner.id === selectedRunner ? null : runner.id)}
                >
                  {selectedRunner === runner.id ? 'Cancel' : 'Assign to Event'}
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
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleAssignEvent(runner)}
                  >
                    Pay & Assign
                  </Button>
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
