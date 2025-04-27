import { Box } from '@mui/material';
import React from 'react';
import EditableBox from './components/EditableText/editableBox';

const App: React.FC = () => {
  // const sidebarItems = [
  //   { label: 'Home', icon: <Home /> },
  //   { label: 'Settings', icon: <Settings /> },
  //   { label: 'About', icon: <Info /> },
  // ];

  // const trendData = [
  //   { month: 'Jan', incCount: 10 },
  //   { month: 'Feb', incCount: 20 },
  //   { month: 'Mar', incCount: 15 },
  //   { month: 'Apr', incCount: 25 },
  //   { month: 'May', incCount: 30 },
  //   { month: 'Jun', incCount: 40 },
  // ];

  return (
    // <Box sx={{ display: 'flex' }}>
    //   <Sidebar items={sidebarItems} />
    //   <Box sx={{ flexGrow: 1, padding: 3 }}>
    //     {/* Main Content */}
    //     <h1>Welcome to the Dashboard</h1>
    //     <p>Click the sidebar icons to navigate!</p>
    //   </Box>
    // </Box>
    // <DonutChart data={[['A', 5000], ['B', 4000], ['C', 20000]]} mainCategory={'Region'} />
    <Box width="1000px" height="200px">
      <EditableBox
        title="Editable Title"
        text="This is the text content."
      />
    </Box>
    // <TrendGraph data={trendData} />
  );
};

export default App;
