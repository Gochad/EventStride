import React, { useState, useEffect } from "react";
import { fetchRunnerById } from "../services/api.tsx";
import { Runner } from "../types";
import { Container, Typography, Paper, Box, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './RunnerDetail.css';
import { useUser } from "../context/User.tsx";

const RunnerDetail: React.FC = () => {
  const { userId } = useUser();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRunner = async () => {
      try {
        if (userId) {
          const runnerData = await fetchRunnerById(userId);
          setRunner(runnerData);
        }
      } catch (error) {
        console.error("Error loading runner or events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRunner();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!runner) {
    return (
      <Typography variant="h6" color="error">
        Runner not found
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Runner Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1">{runner.name}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Age:</Typography>
          <Typography variant="body1">{runner.age}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Category:</Typography>
          <Typography variant="body1">{runner.category}</Typography>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Assigned Events
      </Typography>
      {runner.events && runner.events.length > 0 ? (
        <>
          <List>
            {runner.events.map((event) => (
              <ListItem key={event.id}>
                <ListItemText primary={event.name} secondary={new Date(event.date).toLocaleDateString()} />
              </ListItem>
            ))}
          </List>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Calendar View
            </Typography>
            <Calendar
              tileClassName={({ date }) => {
                const isEventDay = runner.events.some(
                  (e) => new Date(e.date).toDateString() === date.toDateString()
                );
                return isEventDay ? "event-day" : null;
              }}
              tileContent={({ date }) => {
                const event = runner.events.find(
                  (e) => new Date(e.date).toDateString() === date.toDateString()
                );
                return event ? (
                  <Typography variant="caption" color="primary">
                    {event.name}
                  </Typography>
                ) : null;
              }}
            />
          </Box>
        </>
      ) : (
        <Typography variant="body1">No events assigned.</Typography>
      )}
    </Container>
  );
};

export default RunnerDetail;
