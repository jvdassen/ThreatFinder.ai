import './App.css'
import { useState } from 'react'
import DrawIO from './pages/DrawIOMix'
import Analyze from './pages/Analyze'
import Controls from './pages/Controls'
import Stats from './pages/Stats'
import Goals from './pages/Goals'


import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FlagIcon from '@mui/icons-material/FlagOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';
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
import ListSubheader from '@mui/material/ListSubheader'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const drawerWidth = 280

  const [view, setView] = useState('model')
  const [diagram, setDiagram] = useState({})

  function receiveDiagram (diagram) {
    setDiagram(diagram)
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: 'rgb(107, 144, 81)'
      }
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
          ThreatFinder<span style={{color: 'hsl(95, 28%, 44%)'}}>AI</span>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListSubheader style={{lineHeight: '24px'}}>
          Stages
        </ListSubheader>
        <ListItem key={'goals'} disablePadding onClick={() => setView('goals')}>
          <ListItemButton>
            <ListItemIcon>
              <FlagIcon />
            </ListItemIcon>
            <ListItemText primary={'Goals'} />
            {['model', 'analyze', 'controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }} />}
            {view === 'goals' && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'model'} disablePadding onClick={() => setView('model')}>
          <ListItemButton>
            <ListItemIcon>
              <ArchitectureIcon />
            </ListItemIcon>
            <ListItemText primary={'Model'} />
            {['analyze', 'controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }} />}
            {view === 'model' && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'analyze'} disablePadding onClick={() => setView('analyze')}>
          <ListItemButton>
            <ListItemIcon>
              <FunctionsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={'Analyze'} />
            {['controls'].includes(view) && <CheckIcon sx={{ fontSize: 15 }} />}
            {view === 'analyze' && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'controls'} disablePadding onClick={() => setView('controls')}>
          <ListItemButton>
            <ListItemIcon>
              <SecurityOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={'Controls'} />
            {view === 'controls' && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
    </List>
    <Divider />
    <List>
      <ListSubheader style={{lineHeight: '24px'}}>
        Instructions
      </ListSubheader>
      <ListItem>        <Typography
          level="title-lg"
          fontFamily="monospace"
          sx={{ opacity: '50%', marginBottom: '1em' }}
        >
      &rarr; In this stage, a diagram of the architecture must be created. The resulting diagram is used to elicit AI-related assets and the threats surrounding them.
        </Typography>
      </ListItem>
    </List>
    <Stats diagram={diagram}/>
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
          {view === 'model' && <DrawIO  sendDiagram={receiveDiagram}/>}
          {view === 'goals' && <Goals />}
          {view === 'analyze' && <Analyze />}
          {view === 'controls' && <Controls />}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
