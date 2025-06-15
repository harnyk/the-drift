import React from 'react';
import LayeredLayout from './LayeredLayout';
import GameCanvas from './GameCanvas';
import UiOverlay from './UiOverlay';

const App: React.FC = () => {
  return (
    <LayeredLayout layers={[
      <GameCanvas key="game" />, 
      <UiOverlay key="ui" />,
    ]} />
  );
};

export default App;
