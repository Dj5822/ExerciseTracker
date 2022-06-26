import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Datapage from './pages/Datapage';
import Homepage from './pages/Homepage';
import PageLayout from './pages/PageLayout';

function App() {
    return (
        <Routes>
            <Route path="/" element={<PageLayout />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<Homepage />} />
                <Route path="data" element={<Datapage />} />
            </Route>
        </Routes>
    );
}

export default App;
