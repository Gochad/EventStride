import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.tsx";
import { useUser } from "../context/User.tsx";
import { RaceEvent } from "../types";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { createPaymentLink } from '../services/payments.tsx';

const RaceEventList: React.FC = () => {
  const { userId, isAdmin } = useUser();
  const [events, setEvents] = useState<RaceEvent[]>([]);

  useEffect(() => {
    fetchRaceEvents();
  }, []);

  const fetchRaceEvents = async () => {
    try {
      const response = await api.get("/race_events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignEvent = async (eventId: number) => {
    if (!userId) {
      alert("No runner ID found. Please log in.");
      return;
    }

    const selectedEventData = events.find(event => event.id === eventId);

    if (!selectedEventData) {
      alert('Invalid event selected.');
      return;
    }

    try {
      const paymentData = {
        success_url: `${window.location.origin}`,
        cancel_url: `${window.location.origin}`,
        unit_amount: 200,
        runner_name: userId,
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
                  <ListItemText primary={event.name} />
                </Link>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleAssignEvent(event.id)}
                  sx={{ mt: 1 }}
                >
                  Assign to Event
                </Button>
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
