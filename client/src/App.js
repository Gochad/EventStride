import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from './context/Auth.tsx';

const App = () => {
  return (
    <AuthProvider>
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
            path="/runners/new"
            element={
              <ProtectedRoute>
                <RunnerForm />
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
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
