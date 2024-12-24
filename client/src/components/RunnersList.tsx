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
import { fetchRunners, fetchEvents, makeAdmin, deleteRunner } from '../services/api.tsx';
import { useUser } from '../context/User.tsx';
import EditRunnerForm from "./EditRunnerForm.tsx";

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [selectedRunner, setSelectedRunner] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const [editingRunner, setEditingRunner] = useState<Runner | null>(null);

  const { isAdmin } = useUser(); 

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

  const handleDeleteRunner = async (runnerId: number) => {
    if (!window.confirm("Are you sure you want to delete this runner?")) {
      return;
    }

    try {
      await deleteRunner(runnerId);
      alert("Runner deleted successfully!");

      const runnersData = await fetchRunners();
      setRunners(runnersData);
    } catch (error) {
      console.error("Error deleting runner:", error);
      alert("Failed to delete runner.");
    }
  };

  const handleEditRunner = (runner: Runner) => {
    setEditingRunner(runner);
  };

  const handleRunnerUpdated = async () => {
    setEditingRunner(null);
    try {
      const runnersData = await fetchRunners();
      setRunners(runnersData);
    } catch (error) {
      console.error("Error refreshing runners:", error);
    }
  };

  if (editingRunner) {
    return (
      <Container maxWidth="sm">
        <EditRunnerForm
          runner={editingRunner}
          onRunnerUpdated={handleRunnerUpdated}
        />
      </Container>
    );
  }

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
                <Link 
                  to={`/runners/${runner.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                >
                  <ListItemText primary={runner.name} />
                </Link>

                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => makeAdmin(runner.id)}
                  >
                    Make Admin
                  </Button>

                  {isAdmin() && (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleEditRunner(runner)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRunner(runner.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
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
