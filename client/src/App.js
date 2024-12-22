import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.tsx';
import Navbar from './components/Navbar.tsx';
import RunnerList from './components/RunnersList.tsx';
import RunnerDetail from './components/RunnerDetail.tsx';
import RaceEventList from './components/RaceEventList.tsx';
import RaceEventDetail from './components/RaceEventDetail.tsx';
import RaceEventForm from './components/RaceEventForm.tsx';
import RaceEventResults from './components/RaceEventResults.tsx';
import RunnerRegisterForm from './components/RunnerRegistration.tsx';
import RunnerLoginForm from './components/RunnerLoginForm.tsx';
import Home from './components/Home.tsx';

import { UserProvider } from "./context/User.tsx";


const App = () => {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
            <Home />
            }
          />
          <Route
            path="/runners"
            element={
            <RunnerList />
            }
          />
          <Route
            path="/runners/profile"
            element={
              <RunnerDetail />
            }
          />
          <Route
            path="/race_events"
            element={
              <RaceEventList />
            }
          />
          <Route
            path="/race_events/new"
            element={
              <RaceEventForm />
            }
          />
          <Route
            path="/race_events/:id/results"
            element={
              <RaceEventResults />
            }
          />
          <Route
            path="/race_events/:id"
            element={
              <RaceEventDetail />
            }
          />
          <Route path="/runners/register" element={<RunnerRegisterForm />} />
          <Route path="/runners/login" element={<RunnerLoginForm />} />
        </Routes>
      </ThemeProvider>
    </UserProvider>  
  );
};

export default App;
