import './App.css';
import { useState } from 'react';
import DrawIO from './pages/DrawIOMix';
import Analyze from './pages/Analyze';
import Controls from './pages/Controls';
import Goals from './pages/Goals';
import { Button } from '@mui/material';


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import FlagIcon from '@mui/icons-material/FlagOutlined';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function App () {
  const drawerWidth = 240;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [view, setView] = useState('model');

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={'goals'} disablePadding onClick={() => setView('goals')}>
          <ListItemButton>
            <ListItemIcon>
            <FlagIcon/>
            </ListItemIcon>
            <ListItemText primary={'Goals'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'model'} disablePadding onClick={() => setView('model')}>
          <ListItemButton>
            <ListItemIcon>
            <ArchitectureIcon/>
            </ListItemIcon>
            <ListItemText primary={'Model'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'analyze'} disablePadding onClick={() => setView('analyze')}>
          <ListItemButton>
            <ListItemIcon>
              <FilterAltOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'Analyze'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'controls'} disablePadding onClick={() => setView('controls')}>
          <ListItemButton>
            <ListItemIcon>
              <SecurityOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'Controls'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ThreatFinder.AI
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
      <div className="body-wrapper">
        {view === 'model' && <DrawIO />}
        {view === 'goals' && <Goals />}
        {view === 'analyze' && <Analyze />}
        {view === 'controls' && <Controls />}
      </div>
      </Box>
    </Box>
  );
}

export default App;
