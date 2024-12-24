import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { RaceEvent } from "../types";
import { updateRaceEvent } from "../services/api.tsx";

interface EditEventFormProps {
  event: RaceEvent;
  onCancel: () => void;
  onEventUpdated: () => void;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, onCancel, onEventUpdated }) => {
  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(event.date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRaceEvent(event.id, { name, date });
      onEventUpdated();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Could not update event. Check console for details.");
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Event Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Event Date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Box mt={2} display="flex" gap={2}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditEventForm;
