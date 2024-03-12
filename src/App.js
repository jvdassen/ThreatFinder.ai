import './App.css'
import { useState } from 'react'
import DrawIO from './pages/DrawIOMix'
import Analyze from './pages/Analyze'
import Controls from './pages/Controls'
import Goals from './pages/Goals'


import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FlagIcon from '@mui/icons-material/FlagOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit';

function App () {
  const drawerWidth = 240

  const [view, setView] = useState('model')


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const drawer = (
    <div>
      <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ThreatFinderAI
          </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem key={'goals'} disablePadding onClick={() => setView('goals')}>
          <ListItemButton>
            <ListItemIcon>
            <FlagIcon/>
            </ListItemIcon>
            <ListItemText primary={'Goals'} /> 
            {['model', 'analyze', 'controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }}/>}
            {view === 'goals' && <EditIcon sx={{ fontSize: 15 }}/>}
          </ListItemButton>
        </ListItem>
        <ListItem key={'model'} disablePadding onClick={() => setView('model')}>
          <ListItemButton>
            <ListItemIcon>
            <ArchitectureIcon/>
            </ListItemIcon>
            <ListItemText primary={'Model'} />
            {['analyze', 'controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }}/>}
            {view === 'model' && <EditIcon sx={{ fontSize: 15 }}/>}
          </ListItemButton>
        </ListItem>
        <ListItem key={'analyze'} disablePadding onClick={() => setView('analyze')}>
          <ListItemButton>
            <ListItemIcon>
              <FilterAltOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'Analyze'} />
            {['controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }}/>}
            {view === 'analyze' && <EditIcon sx={{ fontSize: 15 }}/>}
          </ListItemButton>
        </ListItem>
        <ListItem key={'controls'} disablePadding onClick={() => setView('controls')}>
          <ListItemButton>
            <ListItemIcon>
              <SecurityOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'Controls'} />
            {view === 'controls' && <EditIcon sx={{ fontSize: 15 }}/>}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
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
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, height: '100vh' }}>
            {view === 'model' && <DrawIO />}
            {view === 'goals' && <Goals />}
            {view === 'analyze' && <Analyze />}
            {view === 'controls' && <Controls />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
