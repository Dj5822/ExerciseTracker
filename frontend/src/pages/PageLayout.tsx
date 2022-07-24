import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, IconButton, List, Toolbar, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';
import { Outlet } from "react-router-dom";
import ColorModeContext from '../context/ColorModeContext';
import { useAuth0 } from '@auth0/auth0-react';

export default function PageLayout() {
    const colorMode = useContext(ColorModeContext);
    let navigate = useNavigate();

    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);    
    };

    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
    } = useAuth0();

    const logoutWithRedirect = () =>
    logout({
    returnTo: window.location.origin,
    });

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="absolute" open={open}>
                <Toolbar
                sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}
                >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    Exercise Tracker
                </Typography>
                {!isAuthenticated &&
                <Button variant="contained" onClick={() => loginWithRedirect()}>Log in</Button>}
                {isAuthenticated &&
                (<div>
                    <Button variant="contained" onClick={() => logoutWithRedirect()}>Log Out</Button>
                  </div>)}
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItemButton onClick={() => navigate('/home')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton onClick={() => navigate('/data')}>
                        <ListItemIcon>
                            <BarChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Data" />
                    </ListItemButton>
                    <ListItemButton onClick={colorMode.toggleColorMode}>
                        <ListItemIcon>
                            <LightModeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Light/Dark" />
                    </ListItemButton>
                </List>
            </Drawer>
            
            <Box component="main"
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )
}