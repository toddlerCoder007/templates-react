import { Box } from '@mui/material';
import React from 'react';
import { sampleItems } from './assets/items';
import PaginatedCardList from './components/PaginatedCards/PaginatedCardList';

const App: React.FC = () => {

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', height: '100vh', width: '100vw' }}>
      {/* <DateFilterComponent /> */}
      {/* <DrawerWithDiscardModal /> */}
      {/* <PageWithFilter /> */}
      {/* <RegionCountrySelector /> */}
      <PaginatedCardList items={sampleItems} />
      {/* <HorizontalCardSlider /> */}
      {/* <HeatMapLegend /> */}
    </Box>

  );
};

export default App;
