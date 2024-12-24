import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, {
  assignRunnerToEvent,
  deleteRaceEvent,
} from "../services/api.tsx";
import { createPaymentLink } from "../services/payments.tsx";
import { useUser } from "../context/User.tsx";
import { RaceEvent } from "../types";
import { Container, Typography, Button, List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import EditEventForm from "./EditRaceEventForm.tsx";

const RaceEventList: React.FC = () => {
  const { userId, isAdmin } = useUser();
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<RaceEvent | null>(null);

  useEffect(() => {
    fetchRaceEvents();
  }, []);

  const fetchRaceEvents = async () => {
    try {
      const response = await api.get("/race_events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching race events:", error);
    }
  };

  const handleAssignEvent = async (eventId: number) => {
    if (!userId) {
      alert("No runner ID found. Please log in.");
      return;
    }

    const selectedEventData = events.find((event) => event.id === eventId);
    if (!selectedEventData) {
      alert("Invalid event selected.");
      return;
    }

    await assignRunnerToEvent(Number(userId), eventId);

    try {
      const paymentData = {
        success_url: `${window.location.origin}`,
        cancel_url: `${window.location.origin}`,
        unit_amount: 200,
        runner_name: userId,
        event_name: selectedEventData.name,
        runner_id: userId,
        event_id: eventId.toString(),
      };

      const response = await createPaymentLink(paymentData);
      const paymentUrl = response.url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      alert("Failed to create payment link. Please try again.");
    }
  };

  const handleEditEvent = (event: RaceEvent) => {
    setEditingEvent(event);
  };

  const handleEventUpdated = () => {
    setEditingEvent(null);
    fetchRaceEvents();
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteRaceEvent(eventId);
      alert("Event deleted successfully!");
      fetchRaceEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  if (editingEvent) {
    return (
      <EditEventForm
        event={editingEvent}
        onCancel={handleCancelEdit}
        onEventUpdated={handleEventUpdated}
      />
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        List of Running Events
      </Typography>

      {isAdmin() && (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/race_events/new"
          sx={{ marginBottom: 2 }}
        >
          Add New Event
        </Button>
      )}

      <List>
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <ListItem>
              <Box display="flex" flexDirection="column" width="100%">
                <Link
                  to={`/race_events/${event.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemText primary={event.name} secondary={event.date} />
                </Link>

                <Box display="flex" gap={2} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleAssignEvent(event.id)}
                  >
                    Assign to Event
                  </Button>

                  {isAdmin() && (
                    <>
                      <Button variant="outlined" onClick={() => handleEditEvent(event)}>
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default RaceEventList;
