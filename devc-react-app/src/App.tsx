import { Home, Info, Settings } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import Sidebar from './components/SideBar/sidebar';

const App: React.FC = () => {
  const sidebarItems = [
    { label: 'Home', icon: <Home /> },
    { label: 'Settings', icon: <Settings /> },
    { label: 'About', icon: <Info /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar items={sidebarItems} />
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {/* Main Content */}
        <h1>Welcome to the Dashboard</h1>
        <p>Click the sidebar icons to navigate!</p>
      </Box>
    </Box>
  );
};

export default App;
