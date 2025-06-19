import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameApp from './GameApp';
import AboutPage from './AboutPage';

const App: React.FC = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<GameApp />} />
            <Route path="/about" element={<AboutPage />} />
        </Routes>
    </BrowserRouter>
);

export default App;
