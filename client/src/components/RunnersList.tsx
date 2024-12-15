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
import { fetchRunners } from '../services/api.tsx';

const RunnerList: React.FC = () => {
  const [runners, setRunners] = useState<Runner[]>([]);

  useEffect(() => {
    const loadRunners = async () => {
      try {
        const data = await fetchRunners();
        setRunners(data);
      } catch (error) {
        console.error("Error loading runners:", error);
      }
    };

    loadRunners();
  }, []);

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
