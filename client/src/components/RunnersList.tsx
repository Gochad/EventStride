import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Runner } from '../types';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import api from '../services/api';

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      const response = await api.get('/runners');
      setRunners(response.data);
    } catch (error) {
      console.error("Error fetching runners:", error.response || error.message);
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
      <List>
        {runners.map((runner) => (
          <ListItem
            key={runner.id}
            button
            component={Link}
            to={`/runners/${runner.id}`}
          >
            <ListItemText primary={runner.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RunnerList;
