import React from 'react';
import { sampleItems } from './assets/items';
import PaginatedCardList from './components/PaginatedCards/PaginatedCardList';

const App: React.FC = () => {

  return (
    <>
      {/* <DateFilterComponent /> */}
      {/* <DrawerWithDiscardModal /> */}
      {/* <PageWithFilter /> */}
      {/* <RegionCountrySelector /> */}
      <PaginatedCardList items={sampleItems} />
    </>

  );
};

export default App;
