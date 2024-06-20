import { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import AddIcon from '@mui/icons-material/Add'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'

export default Scenarios

function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const formattedDate = `${month} ${day}, ${hour}:${minute.toString().padStart(2, '0')}`;
  return formattedDate;
}

function Scenarios({ onModelSelected }) {
  const [selectedModel, selectModel] = useState(localStorage.getItem('selectedModel') || '')
  onModelSelected(selectedModel)

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newKeyProp, setNewKeyProp] = useState('')
  const [newKeyAsset, setNewKeyAsset] = useState('')

  try {
    var loaded = JSON.parse(localStorage.getItem('storedModels')) || []
  } catch (e) {
    loaded = []
  }
  var storedModels = loaded
  const [models, setModels] = useState(storedModels)

  const [selectedModelInfo, selectModelInfo] = useState(storedModels.find(m => m.id === selectedModel))


  const elevation = 1

  useEffect(function handleModelSelection() {
    //console.g('store selected model', selectedModel)
    localStorage.setItem('selectedModel', selectedModel)
    selectModelInfo(models.find(m => m.id === selectedModel))
  }, [models, selectedModel])

  function createModel() {
    var storedModels = JSON.parse(localStorage.getItem('storedModels')) || []
    storedModels.push({
      id: '' + Math.random() * 1e17,
      name: newName,
      date: Date.now(),
      description: newDesc,
      keyProp: newKeyProp,
      keyAsset: newKeyAsset,
      assets: [],
      threats: [],
      diagram: '',
      analysis: {
        summary: {
          losses: [98071.64733176, 196143.29466353,
            294214.94199529, 392286.58932705, 490358.23665881,
            588429.88399058, 686501.53132234, 784573.1786541,
            882644.82598587, 980716.47331763, 1078788.12064939,
            1176859.76798116, 1274931.41531292, 1373003.06264468,
            1471074.70997644, 1569146.35730821, 1667218.00463997,
            1765289.65197173, 1863361.2993035, 1961432.94663526,
            2059504.59396702, 2157576.24129878, 2255647.88863055,
            2353719.53596231, 2451791.18329407, 2549862.83062584,
            2647934.4779576, 2746006.12528936, 2844077.77262112,
            2942149.41995289, 3040221.06728465, 3138292.71461641,
            3236364.36194818, 3334436.00927994, 3432507.6566117,
            3530579.30394347, 3628650.95127523, 3726722.59860699,
            3824794.24593875, 3922865.89327052, 4020937.54060228,
            4119009.18793404, 4217080.83526581, 4315152.48259757,
            4413224.12992933, 4511295.7772611, 4609367.42459286,
            4707439.07192462, 4805510.71925638, 4903582.36658815]
        }
      }
    })
    localStorage.setItem('storedModels', JSON.stringify(storedModels))
    setModels(storedModels)
  }


  function Saved(props) {
    var storedModels = props.storedModels.sort((a, b) => a.date < b.date)

    return (
      <>
        {storedModels.map(function renderModel(model) {
          return (
            <Accordion key={model.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls=""
                id="panel2-header">
                <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                  <Typography kx={{ textTransform: 'inherit' }}>{model.name}</Typography>
                  <span style={{ margin: '0 .5em' }}>—</span>
                  <Typography sx={{ opacity: '50%' }}>
                    {formatDate(new Date(model.date))}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {model.description}
                </Typography>
                <AccordionActions><Button variant="contained" disabled={selectedModel === model.id} onClick={() => { selectModel(model.id) }}>Load</Button></AccordionActions>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </>
    )
  }

  return (
    <div>
      <Typography level="title-lg" variant='h4'>
        Scenarios
      </Typography>
      <Typography
        variant="subtitle">
        Manage your existing scenarios or create a new one from scratch
      </Typography>
      {/*<Typography sx={{ textTransform: 'uppercase', opacity: '50%', marginBottom: '.5em' }}>Add New Threat Model</Typography>*/}

      <Box sx={{ mt: '1em' }}>
        <Saved storedModels={models}></Saved>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}>
            <AddIcon sx={{ height: '1rem', marginTop: '3px' }} />
            <Typography>Create or import a threat model</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
              <TextField label="Name" variant="outlined" required onChange={(e) => { setNewName(e.target.value) }} />
              <TextField label="Description" variant="outlined" onChange={(e) => { setNewDesc(e.target.value) }} multiline required />
              <TextField label="Date" variant="outlined" disabled defaultValue={formatDate(new Date())} />


              <Box sx={{ display: 'flex', gap: '1em' }}>
                <FormControl sx={{ m: 0, minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="key-prop"><em>Property</em></InputLabel>
                  <Select
                    labelId="key-prop"
                    id="key-prop-helper"
                    value={newKeyProp}
                    onChange={(e) => { setNewKeyProp(e.target.value) }}
                    label="Key Security Property">
                    <MenuItem value={'Confidentiality'}>Confidentiality</MenuItem>
                    <MenuItem value={'Integrity'}>Integrity</MenuItem>
                    <MenuItem value={'Availability'}>Availability</MenuItem>
                    <MenuItem value={'Accountability'}>Accountability</MenuItem>
                  </Select>
                  <FormHelperText>Define the most critical security property</FormHelperText>
                </FormControl>
                <span style={{ paddingTop: '1em'}}>of</span>
                <FormControl sx={{ m: 0, minWidth: 120, flexGrow: 1 }}>
                  <InputLabel id="key-asset"><em>Asset</em></InputLabel>
                  <Select
                    labelId="key-asset"
                    id="key-asset-helper"
                    label="Optional: Key Asset"
                    onChange={(e) => { setNewKeyAsset(e.target.value) }}
                    value={newKeyAsset}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Actor'}>Actors</MenuItem>
                    <MenuItem value={'Data'}>Data</MenuItem>
                    <MenuItem value={'Model'}>Models</MenuItem>
                    <MenuItem value={'Artefacts'}>Artefacts</MenuItem>
                    <MenuItem value={'Processes'}>Processes</MenuItem>
                    <MenuItem value={'Environment/tools'}>Environments and Tools</MenuItem>
                  </Select>
                  <FormHelperText>Optional: Define the most critical asset</FormHelperText>
                </FormControl>
              </Box>

              <Button variant="contained" onClick={createModel} >Create</Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>



      {selectedModelInfo &&
        <Box sx={{ marginTop: '1em' }} elevation={0}>
          <Box sx={{}}>
            {/*<Typography variant="h6" sx={{ textTransform: 'uppercase' }}>Selected Model </Typography>*/}
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', mb: '1em' }}>
              <ArrowRightAltIcon color="secondary" />
              <Typography variant="h5" sx={{ fontStyle: 'italic' }}>
                {selectedModelInfo.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
            <Paper elevation={elevation} sx={{ minWidth: '100%', p: '1em', display: 'flex', flexDirection: 'column', textTransform: 'uppercase' }}>
              <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline-flex', opacity: '.6', mr: '.5em' }}>Created</Typography>
                <Typography sx={{ display: 'inline-flex', textTransform: 'initial'}}>{formatDate(new Date(selectedModelInfo.date))}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline', opacity: '.6', mr: '.5em' }}>Description</Typography>
                <Typography sx={{ display: 'inline', textTransform: 'initial'}}>{selectedModelInfo.description}</Typography>
              </Box>
              {selectedModelInfo.keyProp && <Box sx={{ flexGrow: 1}}>
                <Typography sx={{ display: 'inline', opacity: '.6', mr: '.5em' }}>Security Goal</Typography>
                <Typography sx={{ display: 'inline', textTransform: 'initial'}}>Protect the {selectedModelInfo.keyProp} 
                    {selectedModelInfo.keyAsset && <span>
                      <span style={{opacity: '.6'}}> of</span> {selectedModelInfo.keyAsset} 
                    </span>}
                </Typography>
              </Box>}
            </Paper>
              {selectedModelInfo.assets &&
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h4" sx={{ flexGrow: 1, fontSize: '4rem' }}>{selectedModelInfo.assets.length}</Typography>
                  <Typography sx={{ opacity: '.6' }}>ASSETS</Typography>
                </Paper>
                <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'center', flexDirection: 'column' }}>
                  <Typography variant="h4" sx={{ flexGrow: 1, fontSize: '4rem' }}>{selectedModelInfo.threats.length}</Typography>
                  <Typography sx={{ opacity: '.6' }}>THREATS</Typography>
                </Paper>
              </Box>
              }
              <Paper elevation={elevation} sx={{ p: '1em' }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', barGapRatio: 0.1, data: [0, 62155, 124310, 186465, 248620, 310775, 372930, 435085, 497240, 559395, 621550, 683706, 745861, 808016, 870171, 932326, 994481, 1056636, 1118791, 1180946, 1243101, 1305256, 1367411, 1429566, 1491721, 1553876, 1616031, 1678186, 1740341, 1802496, 1864651, 1926807, 1988962, 2051117, 2113272, 2175427, 2237582, 2299737, 2361892, 2424047, 2486202, 2548357, 2610512, 2672667, 2734822, 2796977, 2859132, 2921287, 2983442, 3045597, 3107752] }]}
                  series={[{ color: '#8278d9', label: 'Exposure', data: [1.17448223e-07, 0.00000000e+00, 4.82020378e-07, 8.10875403e-08, 1.12138920e-07, 1.06363041e-06, 2.26047607e-07, 6.82165021e-07, 1.28935625e-06, 5.46375569e-07, 1.09178581e-06, 1.21164735e-06, 8.40478790e-07, 1.10867905e-06, 1.00828495e-06, 8.41926782e-07, 8.38387247e-07, 7.71136072e-07, 6.31807085e-07, 5.74209189e-07, 5.06797127e-07, 4.25709586e-07, 3.38347415e-07, 2.85093495e-07, 2.23151624e-07, 1.80033646e-07, 1.45764507e-07, 1.12138920e-07, 8.86492752e-08, 6.86991661e-08, 5.13232646e-08, 3.74868986e-08, 2.67074041e-08, 2.41331965e-08, 1.65714616e-08, 1.12621584e-08, 7.88351086e-09, 6.59640705e-09, 3.53953549e-09, 2.57420763e-09, 2.57420763e-09, 8.04439884e-10, 1.12621584e-09, 1.44799179e-09, 4.82663930e-10, 1.60887977e-10, 4.82663930e-10, 1.60887977e-10, 1.60887977e-10, 3.21775953e-10] }]}
                  width={500}
                  height={300} />
              </Paper>
              <Paper elevation={elevation} sx={{ p: '1em' }}>
                <LineChart
                  xAxis={[{ data: [0.0, 0.0, 155845.0, 162960.0, 168137.0, 172756.0, 177430.0, 183330.0, 193092.0, 298540.0, 311280.0, 318435.0, 323614.0, 328260.0, 332373.0, 336080.0, 339674.0, 343581.0, 347211.0, 351139.0, 355071.0, 359438.0, 364612.0, 370000.0, 377306.0, 388848.0, 426367.0, 452871.0, 464234.0, 471692.0, 478063.0, 483319.0, 487595.0, 491523.0, 495433.0, 499205.0, 502813.0, 506332.0, 510040.0, 513322.0, 516595.0, 519940.0, 523345.0, 526952.0, 530341.0, 534061.0, 538037.0, 542282.0, 546445.0, 551307.0, 556943.0, 562716.0, 569733.0, 578237.0, 589165.0, 600337.0, 610600.0, 619234.0, 626408.0, 632673.0, 638640.0, 643828.0, 648796.0, 653545.0, 657458.0, 661384.0, 665120.0, 669059.0, 672730.0, 676516.0, 679977.0, 683534.0, 687087.0, 690535.0, 694078.0, 697789.0, 701503.0, 705406.0, 709120.0, 713409.0, 717550.0, 721854.0, 726651.0, 731463.0, 736250.0, 740812.0, 746329.0, 752102.0, 758010.0, 764406.0, 770572.0, 776886.0, 783680.0, 789731.0, 795124.0, 800887.0, 806419.0, 811811.0, 817031.0, 821843.0, 826654.0, 831245.0, 836011.0, 840492.0, 844977.0, 849327.0, 853699.0, 857549.0, 861911.0, 866261.0, 870441.0, 874957.0, 879311.0, 883779.0, 888293.0, 893408.0, 898042.0, 903242.0, 908763.0, 913657.0, 918901.0, 924440.0, 929607.0, 935421.0, 940864.0, 946026.0, 952181.0, 957989.0, 964757.0, 970920.0, 976844.0, 982554.0, 988565.0, 994409.0, 1000730.0, 1006685.0, 1012757.0, 1018243.0, 1024097.0, 1030440.0, 1035871.0, 1041264.0, 1047151.0, 1053442.0, 1059230.0, 1065621.0, 1071808.0, 1078175.0, 1084113.0, 1090728.0, 1097406.0, 1104140.0, 1111450.0, 1118659.0, 1125661.0, 1132537.0, 1139792.0, 1147466.0, 1155057.0, 1162733.0, 1170936.0, 1179060.0, 1186978.0, 1195809.0, 1204025.0, 1212874.0, 1221306.0, 1229622.0, 1238616.0, 1248344.0, 1257174.0, 1267384.0, 1277123.0, 1287221.0, 1297729.0, 1308913.0, 1320752.0, 1333477.0, 1345721.0, 1358354.0, 1371520.0, 1385000.0, 1400414.0, 1416293.0, 1432440.0, 1449069.0, 1465838.0, 1484352.0, 1504041.0, 1524558.0, 1547378.0, 1570968.0, 1600683.0, 1628667.0, 1665219.0, 1708140.0, 1754787.0, 1818593.0, 1904674.0, 2040755.0] }]}
                  series={[
                    {
                      color: '#8278d9',
                      data: [0.99999, 0.99499, 0.98999, 0.98499, 0.97999, 0.97499, 0.96999, 0.96499, 0.95999, 0.95499, 0.94999, 0.94499, 0.93999, 0.93499, 0.92999, 0.92499, 0.91999, 0.91499, 0.90999, 0.90499, 0.89999, 0.89499, 0.8899900000000001, 0.8849899999999999, 0.87999, 0.8749899999999999, 0.86999, 0.86499, 0.85999, 0.85499, 0.84999, 0.84499, 0.83999, 0.83499, 0.82999, 0.82499, 0.81999, 0.81499, 0.80999, 0.80499, 0.79999, 0.79499, 0.78999, 0.78499, 0.77999, 0.7749900000000001, 0.76999, 0.7649900000000001, 0.7599899999999999, 0.75499, 0.7499899999999999, 0.74499, 0.7399899999999999, 0.73499, 0.72999, 0.72499, 0.71999, 0.71499, 0.70999, 0.70499, 0.69999, 0.69499, 0.68999, 0.68499, 0.67999, 0.67499, 0.66999, 0.66499, 0.6599900000000001, 0.65499, 0.6499900000000001, 0.64499, 0.6399900000000001, 0.6349899999999999, 0.62999, 0.6249899999999999, 0.61999, 0.6149899999999999, 0.60999, 0.60499, 0.59999, 0.59499, 0.58999, 0.58499, 0.57999, 0.57499, 0.56999, 0.56499, 0.55999, 0.55499, 0.54999, 0.54499, 0.53999, 0.5349900000000001, 0.52999, 0.5249900000000001, 0.51999, 0.5149900000000001, 0.5099899999999999, 0.50499, 0.49999000000000005, 0.49499000000000004, 0.48999000000000004, 0.48499000000000003, 0.47999, 0.47499, 0.46999, 0.46499, 0.45999, 0.45499, 0.44999, 0.44499, 0.43999, 0.43499, 0.42999, 0.42499, 0.41999, 0.41498999999999997, 0.40998999999999997, 0.40498999999999996, 0.39998999999999996, 0.39498999999999995, 0.38998999999999995, 0.38499000000000005, 0.37999000000000005, 0.37499000000000005, 0.36999000000000004, 0.36499000000000004, 0.35999000000000003, 0.35499, 0.34999, 0.34499, 0.33999, 0.33499, 0.32999, 0.32499, 0.31999, 0.31499, 0.30999, 0.30499, 0.29999, 0.29499, 0.28998999999999997, 0.28498999999999997, 0.27998999999999996, 0.27498999999999996, 0.26998999999999995, 0.26498999999999995, 0.25999000000000005, 0.25499000000000005, 0.24999000000000005, 0.24499000000000004, 0.23999000000000004, 0.23499000000000003, 0.22999000000000003, 0.22499000000000002, 0.21999000000000002, 0.21499000000000001, 0.20999, 0.20499, 0.19999, 0.19499, 0.18999, 0.18499, 0.17998999999999998, 0.17498999999999998, 0.16998999999999997, 0.16498999999999997, 0.15998999999999997, 0.15498999999999996, 0.14998999999999996, 0.14498999999999995, 0.13998999999999995, 0.13499000000000005, 0.12999000000000005, 0.12499000000000005, 0.11999000000000004, 0.11499000000000004, 0.10999000000000003, 0.10499000000000003, 0.09999000000000002, 0.09499000000000002, 0.08999000000000001, 0.08499000000000001, 0.07999, 0.07499, 0.06999, 0.06498999999999999, 0.05998999999999999, 0.05498999999999998, 0.04998999999999998, 0.044989999999999974, 0.03998999999999997, 0.034989999999999966, 0.02998999999999996, 0.024989999999999957, 0.019989999999999952, 0.014989999999999948, 0.009990000000000054, 0.00499000000000005],
                      showMark: false
                    },
                  ]}
                  width={500}
                  height={300} />
              </Paper>
              <Paper elevation={elevation} sx={{ p: '1em', display: 'flex', flexGrow: 1, alignItems: 'left', flexDirection: 'column', textTransform: 'uppercase' }}>
                <Typography sx={{ flexGrow: 1, display: 'flex', textAlign: 'center', alignItems: 'center' }}>Annualized Loss (CHF)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '4rem' }}>826'802</Typography>
                <Typography sx={{ opacity: '.6' }}>Expected Loss P50)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '3rem' }}>515'378</Typography>
                <Typography sx={{ opacity: '.6' }}>Optimistic Loss (P20)</Typography>
                <Typography variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: '3rem' }}>1'171'836</Typography>
                <Typography sx={{ opacity: '.6' }}>Pessimistic Loss (P80)</Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      }

    </div>
  )
}

