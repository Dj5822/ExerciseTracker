import React, { useContext, useEffect, useState } from 'react';
import { Box, Divider, IconButton, List, Toolbar, Typography, Card, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';
import Container from '@mui/material/Container';
import {AppContext} from "../context/AppContextProvider"
import ExerciseLog from '../components/ExerciseLog';

const Dashboard = () => {
  const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
        
    };

    const { isLoading } = useContext(AppContext);

    return <Box sx={{ display: 'flex' }}>

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
                Dashboard
            </Typography>
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
            <ListItemButton>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
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
            <Container maxWidth="lg" sx={{ mt: 16, mb: 4 }}>
                <Card sx={{ mt: 8, p: 2}}>
                    {isLoading ? <CircularProgress /> : <ExerciseLog /> }       
                </Card>
            </Container>
        </Box>
    </Box>
}

export default Dashboard;