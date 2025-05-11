import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

const AssistantDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Main Assistant Panel */}
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h5" gutterBottom>
              Your Personal Assistant
            </Typography>
            <Typography variant="body1">
              I'm here to help you with your daily tasks and preferences.
            </Typography>
          </Item>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2">
              • Check expenses
              <br />
              • Track fitness
              <br />
              • Update preferences
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssistantDashboard;
