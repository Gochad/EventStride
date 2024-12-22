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
import ProtectedRoute from "./components/ProtectedRoute.tsx";


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runners"
          element={
            <ProtectedRoute>
              <RunnerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runners/:id"
          element={
            <ProtectedRoute>
              <RunnerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/race_events"
          element={
            <ProtectedRoute>
              <RaceEventList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/race_events/new"
          element={
            <ProtectedRoute>
              <RaceEventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/race_events/:id/results"
          element={
            <ProtectedRoute>
              <RaceEventResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/race_events/:id"
          element={
            <ProtectedRoute>
              <RaceEventDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/runners/register" element={<RunnerRegisterForm />} />
        <Route path="/runners/login" element={<RunnerLoginForm />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
