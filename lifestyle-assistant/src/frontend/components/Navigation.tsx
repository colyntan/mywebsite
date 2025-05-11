import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AttachMoney as AttachMoneyIcon,
  FitnessCenter as FitnessCenterIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarTodayIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface NavigationProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Finance',
      icon: <AttachMoneyIcon />,
      path: '/expenses',
    },
    {
      text: 'Fitness',
      icon: <FitnessCenterIcon />,
      path: '/fitness',
    },
    {
      text: 'Preferences',
      icon: <SettingsIcon />,
      path: '/preferences',
    },
    {
      text: 'Shopping',
      icon: <ShoppingCartIcon />,
      path: '/shopping',
    },
    {
      text: 'Calendar',
      icon: <CalendarTodayIcon />,
      path: '/calendar',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Lifestyle Assistant
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton color="inherit">
              <ReceiptIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 4 }}>
          {/* {children} */}
        </Box>
      </Box>
    </Box>
  );
};

export default Navigation;
