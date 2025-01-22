import './App.css'
import { useState } from 'react'
import DrawIO from './pages/DrawIOMix'
import Analyze from './pages/Analyze'
import Controls from './pages/Controls'
import Stats from './pages/Stats'
import Scenarios from './pages/Scenarios'
import Instructions from './pages/Instructions'
import Risks from './pages/Risks'

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
import CandlestickChartRoundedIcon from '@mui/icons-material/CandlestickChartRounded';
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import {
  ThemeProvider,
  createTheme,
  useColorScheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ListSubheader from "@mui/material/ListSubheader";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
        width: 1,
      }}
    >
      <FormControl>
        <FormLabel id="theme-toggle" style={{ lineHeight: "24px" }}>
          Theme
        </FormLabel>
        <RadioGroup
          aria-labelledby="theme-toggle"
          name="theme-toggle"
          row
          value={mode}
          onChange={(event) => setMode(event.target.value)}
        >
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

function App() {
  const drawerWidth = 280

  const [view, setView] = useState('goals')
  const [diagram, setDiagram] = useState({})

  const [selectedModel, setSelectedModel] = useState('')
  const [nrAssets, setNrAssets] = useState(0)
  const [nrThreats, setNrThreats] = useState(0)

  function updateSelectedModel (newModelSelection) {
    console.log('newModelSelection', newModelSelection)
    setSelectedModel(newModelSelection)
  }

  function updateNrAssets(newNrAssets) {
    console.log('updateNrAssets', newNrAssets)
    setNrAssets(newNrAssets)
  }
 
  function updateNrThreats(newNrThreats) {
    console.log('newNrThreats', newNrThreats)
    setNrThreats(newNrThreats)
  }

  function receiveDiagram (diagram) {
    setDiagram(diagram)
  }

  const darkTheme = createTheme({
    // palette: {
    //   mode: 'dark',
    //   primary: {
    //     main: '#3b512a'
    //   },
    //   secondary: {
    //     main: '#8278d9'
    //   }
    // },
    colorSchemes: {
      // dark: true,
      dark: {
        palette: {
          primary: {
            main: "#3b512a",
          },
          secondary: {
            main: "#8278d9",
          },
        },
      },
      light: {
        palette: {
          primary: {
            main: "#FF5733",
          },
          // ...other tokens
        },
      },
    },
    typography: {
      h4: {
        fontFamily: '"Noto Sans Mono", monospace',
        color: "#8278d9",
        fontWeight: "400",
      },
      h5: {
        fontFamily: '"Noto Sans Mono", monospace',
        opacity: "0.6",
      },
      subtitle: {
        fontFamily: '"Noto Sans Mono", monospace',
        opacity: "0.6",
      },
    },
  });

  const drawer = (
    <div>
      <Toolbar
        sx={{
          backgroundImage: "url(/public/noise4.png)",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".1rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          ThreatFinder<span style={{ color: "hsl(95, 28%, 44%)" }}>AI</span>
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ModeSwitcher />
      </List>
      <List>
        <ListSubheader style={{ lineHeight: "24px" }}>Stages</ListSubheader>
        <ListItem key={"goals"} disablePadding onClick={() => setView("goals")}>
          <ListItemButton>
            <ListItemIcon>
              <FlagIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Scenarios"} />
            {["risks", "model", "analyze", "controls"].includes(view) && (
              <CheckIcon sx={{ fontSize: 15 }} />
            )}
            {view === "goals" && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={"model"} disablePadding>
          <ListItemButton
            disabled={!selectedModel}
            onClick={() => setView("model")}
          >
            <ListItemIcon>
              <ArchitectureIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Model"} />
            {["risks", "analyze", "controls"].includes(view) && (
              <CheckIcon sx={{ fontSize: 15 }} />
            )}
            {view === "model" && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={"analyze"} disablePadding>
          <ListItemButton
            disabled={!nrAssets | !selectedModel}
            onClick={() => setView("analyze")}
          >
            <ListItemIcon>
              <FunctionsOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Analyze"} />
            {["risks", "controls"].includes(view) && (
              <CheckIcon sx={{ fontSize: 15 }} />
            )}
            {view === "analyze" && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={"controls"} disablePadding>
          <ListItemButton
            disabled={!nrThreats | !selectedModel}
            onClick={() => setView("controls")}
          >
            <ListItemIcon>
              <SecurityOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Controls"} />
            {["risks"].includes(view) && <CheckIcon sx={{ fontSize: 15 }} />}
            {view === "controls" && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={"Risks"} disablePadding>
          <ListItemButton
            disabled={!nrThreats | !selectedModel}
            onClick={() => setView("risks")}
          >
            <ListItemIcon>
              <CandlestickChartRoundedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Risks"} />
            {view === "risks" && <EditIcon sx={{ fontSize: 15 }} />}
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader style={{ lineHeight: "24px" }}>
          Instructions
        </ListSubheader>
        <ListItem>
          <Instructions />
        </ListItem>
      </List>
      <Stats diagram={diagram} nrAssets={updateNrAssets} />
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme} defaultMode="dark">
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            backgroundImage: "url(noise4.png)",
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: "100vh",
          }}
        >
          {view === "goals" && (
            <Scenarios
              onModelSelected={(selectedModel) => {
                updateSelectedModel(selectedModel);
              }}
            />
          )}
          {view === "model" && <DrawIO sendDiagram={receiveDiagram} />}
          {view === "analyze" && <Analyze onNrThreats={updateNrThreats} />}
          {view === "controls" && <Controls />}
          {view === "risks" && <Risks />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App
