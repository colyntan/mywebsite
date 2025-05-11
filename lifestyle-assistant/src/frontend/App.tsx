import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Navigation from './components/Navigation.tsx';
import AssistantDashboard from './pages/AssistantDashboard';
import ExpenseTracker from './pages/ExpenseTracker';
import FitnessTracker from './pages/FitnessTracker';
import Preferences from './pages/Preferences';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation>
          <Routes>
            <Route path="/" element={<AssistantDashboard />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/fitness" element={<FitnessTracker />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </Navigation>
      </Router>
    </ThemeProvider>
  );
}

export default App;
