import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.tsx';
import Navbar from './components/Navbar.tsx';
import RunnerList from './components/RunnersList.tsx';
import RunnerDetail from './components/RunnerDetail.tsx';
import RunnerForm from './components/RunnerForm.tsx';
import RaceEventList from './components/RaceEventList.tsx';
import RaceEventDetail from './components/RaceEventDetail.tsx';
import RaceEventForm from './components/RaceEventForm.tsx';
import RaceEventResults from './components/RaceEventResults.tsx';
import Home from './components/Home.tsx';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/runners" element={<RunnerList />} />
        <Route path="/runners/new" element={<RunnerForm />} />
        <Route path="/runners/:id" element={<RunnerDetail />} />
        <Route path="/race_events" element={<RaceEventList />} />
        <Route path="/race_events/new" element={<RaceEventForm />} />
        <Route path="/race_events/:id/results" element={<RaceEventResults />} />
        <Route path="/race_events/:id" element={<RaceEventDetail />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
