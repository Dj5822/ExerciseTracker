import { useAuth0 } from '@auth0/auth0-react';
import { PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ColorModeContext from './context/ColorModeContext';
import Datapage from './pages/Datapage';
import Homepage from './pages/Homepage';
import PageLayout from './pages/PageLayout';

function App() {
    const [mode, setMode] = React.useState<PaletteMode>('dark');
    const colorMode = React.useMemo(
        () => ({
        // The dark mode switch would invoke this method
        toggleColorMode: () => {
            setMode((prevMode: PaletteMode) => prevMode === 'light' ? 'dark' : 'light');
            },
        }),
        [],
    );

    const theme = React.useMemo(() => createTheme({
        palette: {
            mode
        }
    }), [mode]);

    const { isLoading, error } = useAuth0();

    if (error) {
    return <div>Oops... {error.message}</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<PageLayout />}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<Homepage />} />
                        <Route path="data" element={<Datapage />} />
                    </Route>
                </Routes>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
