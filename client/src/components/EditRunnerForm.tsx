import React, { useState } from "react";
import { updateRunner } from "../services/api.tsx";
import { Runner } from "../types";
import { TextField, Button, Box, Typography } from "@mui/material";

interface EditRunnerFormProps {
  runner: Runner; 
  onRunnerUpdated?: () => void;
}

const EditRunnerForm: React.FC<EditRunnerFormProps> = ({ runner, onRunnerUpdated }) => {
  const [name, setName] = useState(runner.name);
  const [age, setAge] = useState(runner.age);
  const [category, setCategory] = useState(runner.category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRunner(runner.id, {
        name,
        age,
        category,
      });
      if (onRunnerUpdated) {
        onRunnerUpdated();
      }
    } catch (error) {
      console.error("Error updating runner:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" mb={2}>
        Edit your profile
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
};

export default EditRunnerForm;
