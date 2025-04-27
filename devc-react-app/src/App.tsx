import React from 'react';
import EditableBox from './components/EditableText/editableBox';

const App: React.FC = () => {
  // const sidebarItems = [
  //   { label: 'Home', icon: <Home /> },
  //   { label: 'Settings', icon: <Settings /> },
  //   { label: 'About', icon: <Info /> },
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
    <EditableBox
      title="Editable Title"
      text="This is the text content."
      width="300px"
      height="200px"
    />
  );
};

export default App;
