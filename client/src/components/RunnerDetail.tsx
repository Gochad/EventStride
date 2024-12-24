import React, { useState, useEffect } from "react";
import { fetchRunnerById, deleteRunner } from "../services/api.tsx";
import { Runner } from "../types";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RunnerDetail.css";
import { useUser } from "../context/User.tsx";
import EditRunnerForm from "./EditRunnerForm.tsx";

const RunnerDetail: React.FC = () => {
  const { userId } = useUser();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadRunner = async () => {
    try {
      if (userId) {
        setLoading(true);
        const runnerData = await fetchRunnerById(userId);
        setRunner(runnerData);
      }
    } catch (error) {
      console.error("Error loading runner or events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRunner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleRunnerUpdated = async () => {
    await loadRunner();
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!runner) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your runner?"
    );
    if (!confirmDelete) return;

    try {
      await deleteRunner(runner.id);
      alert("Runner deleted successfully!");
      setRunner(null);
    } catch (error) {
      console.error("Error deleting runner:", error);
      alert("Failed to delete runner.");
    }
  };

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
      {isEditing ? (
        <EditRunnerForm runner={runner} onRunnerUpdated={handleRunnerUpdated} />
      ) : (
        <>
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

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Assigned Events
          </Typography>

          {runner.events && runner.events.length > 0 ? (
            <List>
              {runner.events.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={event.name}
                    secondary={new Date(event.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              No events assigned.
            </Typography>
          )}

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Events calendar
            </Typography>
            <Calendar
              tileClassName={({ date }) => {
                if (!Array.isArray(runner.events)) return null;

                const isEventDay = runner.events.some(
                  (e) => new Date(e.date).toDateString() === date.toDateString()
                );
                return isEventDay ? "event-day" : null;
              }}
              tileContent={({ date }) => {
                if (!Array.isArray(runner.events)) return null;

                const event = runner.events.find(
                  (e) => new Date(e.date).toDateString() === date.toDateString()
                );
                return event ? (
                  <Box textAlign="center">
                    <Typography variant="caption" className="calendar-event-name">
                      {event.name}
                    </Typography>
                  </Box>
                ) : null;
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default RunnerDetail;
