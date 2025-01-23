import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CardActions
} from '@mui/material'
import { useState, forwardRef } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { BarChart } from '@mui/x-charts/BarChart'
import Select from '@mui/material/Select';
import { Input as BaseInput, InputProps, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';

import ImpactList from './Impacts.json'

export default function Controls() {
  try {
    var [selectedModel] = useState(localStorage.getItem("selectedModel") || "");
    var loadedTM =
      JSON.parse(localStorage.getItem("threatModels"))[selectedModel] || [];
    // console.log(loadedTM);
  } catch (e) {
    console.warn("error parsing threats from storage", e);
    loadedTM = [];
  }

  // var loadedRiskScenarios = JSON.parse(
  //   localStorage.getItem("riskScenarios")
  // ).filter((m) => m.model === selectedModel);
  const riskScenarios = JSON.parse(
    localStorage.getItem("riskScenarios") || "[]"
  );
  const loadedRiskScenarios = riskScenarios.filter(
    (scenario) => scenario.model === selectedModel
  );
  const [riskName, setRiskName] = useState("");

  //var [threatModel, _] = useState(loadedTM)
  var [risks, setRisks] = useState(loadedRiskScenarios);

  var [selectedThreat, setSelectedThreat] = useState({});

  function ImpactCard(props) {
    var { impact } = props;
    var [quantified, setQuantified] = useState(false);
    var [minInc, setMinInc] = useState(0);
    var [maxInc, setMaxInc] = useState();

    var [minLoss, setMinLoss] = useState(0);
    var [maxLoss, setMaxLoss] = useState();

    var [confInc, setConfInc] = useState(0.95);
    var [confLoss, setConfLoss] = useState(0.95);

    var [quantification, setQuant] = useState({});

    // async function quantify (minInc, maxInc, minLoss, maxLoss, confInc, confLoss) {
    //   console.log('quantification using', arguments)
    //   var quantificationRes = await fetch('https://threatfinderai-quant.comsyslab.xyz/quant?' + new URLSearchParams({
    //     minInc: minInc,
    //     maxInc: maxInc,
    //     minLoss: minLoss,
    //     maxLoss: maxLoss,
    //     confInc: confInc,
    //     confLoss: confLoss
    //   }))
    //   var quantification = await quantificationRes.json()
    //   console.log(quantification)
    //   setQuant(quantification)
    //   setQuantified(true)
    // }

    // local quntification function with reduced number of samples
    // based code generated using Qwen2.5-Coder-32B-Instruct & ChatGPT
    function quantify(minInc, maxInc, minLoss, maxLoss, confInc, confLoss) {
      console.log("quantification using", arguments);

      const numSamples = 10000;
      const ranges = [
        [minInc, maxInc, confInc],
        [minLoss, maxLoss, confLoss],
      ];

      function riskLoss(x) {
        const Inc = x[0];
        const Loss = x[1];
        // number of occurances x loss potential, gives risk loss $ number
        // confidence for number of occurances and loss potential is already considered
        // while generating the random series
        return Inc * Loss;
      }

      const monteCarloSim = (func, ranges, numSamples = 1000) => {
        const samples = Array.from({ length: numSamples }, () =>
          Array.from({ length: ranges.length }, (_, i) => {
            const [low, high, confidence] = ranges[i];
            return (Math.random() * (high - low) + low) * confidence;
          })
        );
        // Calcluate risk loss for each sample
        const results = samples.map((sample) => func(sample));
        return results;
      };

      const results = monteCarloSim(riskLoss, ranges, numSamples);

      // mean and standard deviation from simulation result
      // Approximate normal distribution curve
      const mean = results.reduce((a, b) => a + b, 0) / results.length;
      const variance =
        results.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
        results.length;
      const stdDev = Math.sqrt(variance);

      // Define the range for the normal distribution
      const range = [Math.min(...results), Math.max(...results)];
      const numBins = 30; // Number of bins

      // generate normal distribution values based on mean and standard deviation
      // Generate a new set of values that follow a normal distribution within the specified range

      const generateNormalDistribution = (mean, stdDev, numSamples, range) => {
        const [low, high] = range;
        const samples = [];
        while (samples.length < numSamples) {
          // Box-Muller transform to generate a normal distribution
          let u1 = Math.random();
          let u2 = Math.random();
          let z0 =
            Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          let value = mean + stdDev * z0;

          // Truncate values to the specified range
          if (value >= low && value <= high) {
            samples.push(value);
          }
        }
        return samples;
      };

      const normalDistributedValues = generateNormalDistribution(
        mean,
        stdDev,
        1000,
        range
      );
      // const normalDistributedValues = results

      const minResult = Math.min(...normalDistributedValues);
      const maxResult = Math.max(...normalDistributedValues);
      const binWidth = (maxResult - minResult) / numBins;

      const bins = Array.from({ length: numBins }, (_, i) => ({
        start: (minResult + i * binWidth).toFixed(2),
        end: (minResult + (i + 1) * binWidth).toFixed(2),
        count: 0,
      }));

      // Count the frequency of results in each bin
      normalDistributedValues.forEach((result) => {
        for (let bin of bins) {
          if (result >= bin.start && result < bin.end) {
            bin.count++;
            break;
          }
        }
      });

      // Normalize the bin counts
      const totalSamples = normalDistributedValues.length;
      const normalizedCounts = bins.map(
        (bin) => bin.count / totalSamples / binWidth
      );

      // Create chart data for histogram
      const histogramData = bins.map((bin) => ({
        value: (parseFloat(bin.start) + parseFloat(bin.end)) / 2,
        count: bin.count,
        label: `${bin.start} - ${bin.end}`,
        normalizedCount: normalizedCounts[bins.indexOf(bin)],
      }));

      // descending order
      // const sortedResults = histogramData.sort((a, b) => b.value - a.value);
      // const midIndex = Math.floor(sortedResults.length / 2);
      // const firstHalf = sortedResults.slice(0, midIndex);
      // const secondHalf = sortedResults.slice(midIndex);
      // // Reverse the second half to make it descending
      // const secondHalfDescending = [...secondHalf].reverse();
      // const sortedAndReversedValues = [...firstHalf, ...secondHalfDescending];

      // const sortedHistogramData = histogramData.sort((a, b) => a.value - b.value);

      // Generate normal distribution curve
      // const xValues = Array.from({ length: numSamples }, (_, i) =>
      //   minResult + (maxResult - minResult) * (i / (numSamples - 1))
      // );
      // const normalCurve = xValues.map(x => normalDistribution(x, meanArea, stdArea, range));

      const quantification = {
        hist: histogramData.map((data) => data.count),
        bin_edges: histogramData.map((data) => data.value.toFixed(2)),
        label: histogramData.map((data) => data.label),
      };
      setQuant(quantification);
      setQuantified(true);
    }

    return (
      <Card
        sx={{ flex: "1 0 calc(50% - 1em)", minWidth: "300px" }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            variant="h7"
            component="div"
            sx={{ mb: ".5em", opacity: 1 }}
          >
            {impact}
          </Typography>

          <Typography
            sx={{
              opacity: 0.5,
              fontFamily: "mono",
              textTransform: "uppercase",
            }}
          >
            Expected incidents
          </Typography>
          <Box sx={{ display: "flex", gap: ".5em", mb: ".5em" }}>
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={minInc}
              onChange={(e) => {
                setMinInc(e.target.value);
              }}
              startAdornment={<InputAdornment key={minInc}>min</InputAdornment>}
            />
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={maxInc}
              onChange={(e) => {
                setMaxInc(e.target.value);
              }}
              startAdornment={<InputAdornment key={maxInc}>max</InputAdornment>}
            />
          </Box>

          <Typography
            sx={{
              opacity: 0.5,
              fontFamily: "mono",
              textTransform: "uppercase",
            }}
          >
            Expected loss per occurrence
          </Typography>
          <Box sx={{ display: "flex", gap: ".5em", mb: ".5em" }}>
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={minLoss}
              onChange={(e) => {
                setMinLoss(e.target.value);
              }}
              startAdornment={
                <InputAdornment key={minLoss}>min</InputAdornment>
              }
            />
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={maxLoss}
              onChange={(e) => {
                setMaxLoss(e.target.value);
              }}
              startAdornment={
                <InputAdornment key={maxLoss}>max</InputAdornment>
              }
            />
          </Box>

          <Typography
            sx={{
              opacity: 0.5,
              fontFamily: "mono",
              textTransform: "uppercase",
            }}
          >
            Confidence
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: ".5em" }}>
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={confInc}
              onChange={(e) => {
                setConfInc(e.target.value);
              }}
              startAdornment={
                <InputAdornment key={confInc}>Incidents</InputAdornment>
              }
            />
            <NumberInput
              sx={{ flexGrow: 1 }}
              value={confLoss}
              onChange={(e) => {
                setConfLoss(e.target.value);
              }}
              startAdornment={
                <InputAdornment key={confLoss}>Losses</InputAdornment>
              }
            />
          </Box>
          {quantified && (
            <Box sx={{ display: "flex" }}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    barGapRatio: 0.1,
                    label: "Exposure",
                    data: quantification.bin_edges,
                  },
                ]}
                series={[
                  {
                    color: "#8278d9",
                    type: "bar",
                    label: "Count",
                    data: quantification.hist,
                  },
                ]}
                height={300}
              />
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            disabled={quantified}
            startIcon={<AddIcon />}
            onClick={(e) => {
              console.log(e);
            }}
          >
            Include
          </Button>
          <Button
            size="small"
            color="secondary"
            startIcon={<FunctionsRoundedIcon />}
            disabled={!(minLoss >= 0 && maxLoss && minInc >= 0 && maxInc)}
            onClick={() => {
              quantify(minInc, maxInc, minLoss, maxLoss, confInc, confLoss);
            }}
          >
            Quantify
          </Button>
        </CardActions>
      </Card>
    );
  }

  function Impacts(props) {
    var { threat } = props;
    var threatInModel = loadedTM.find((t) => t.id === threat);

    if (threatInModel) {
      // var impact = threatInModel.threat['Potential Impact']
      var impacts = threatInModel.threat["Potential Impact"].split(", ");
      // console.log(impacts);
      return (
        <>
          {impacts.map(function renderImpact(impact) {
            return (
              <>
                <Typography sx={{ mt: "1em", mb: "1em" }}>
                  Impacts potentially related to the{" "}
                  <Typography sx={{ display: "inline" }} color="secondary">
                    {impact}
                  </Typography>{" "}
                  of{" "}
                  <Typography color="secondary" sx={{ display: "inline" }}>
                    {threatInModel.targetedAsset.assetDisplayname}
                  </Typography>
                </Typography>
                <Typography variant="h4">Tangible</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1em" }}>
                  {ImpactList[impact].tangible.map((impact, i) => {
                    return <ImpactCard impact={impact} key={i}></ImpactCard>;
                  })}
                </Box>
                <Typography variant="h4">Intangible</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1em" }}>
                  {ImpactList[impact].intangible.map((impact, i) => {
                    return <ImpactCard impact={impact} key={i}></ImpactCard>;
                  })}
                </Box>
              </>
            );
          })}
        </>
      );
    }
  }

  function handleSaveRisk() {
    var newRisk = {
      threat: selectedThreat,
      riskname: riskName,
      model: selectedModel,
    };
    const updatedRiskScenarios = [...risks, newRisk];
    setRisks(updatedRiskScenarios);
    localStorage.setItem("riskScenarios", JSON.stringify(updatedRiskScenarios));
  }

  return (
    <>
      <Typography level="title-lg" variant="h4">
        Formulate Risk Scenarios
      </Typography>
      <Typography variant="subtitle">
        Assess Impacts and Communicate Strategic Risk Exposure
      </Typography>

      <Box sx={{ mt: "1em" }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ textTransform: "capitalize" }}
          >
            <AddIcon sx={{ height: "1rem", marginTop: "3px" }} />
            <Typography>Existing Risk Scenarios</Typography>
          </AccordionSummary>
          {risks.map(function renderThreat(risk) {
            // console.log(risk);
            var threatInModel = loadedTM.find((t) => t.id === risk.threat);
            // console.log(threatInModel);
            return (
              <AccordionDetails key={risk.riskname}>
                <Box
                  sx={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography kx={{ textTransform: "inherit" }}>
                      Threat: {threatInModel.threat.Threat}
                    </Typography>
                    <span style={{ margin: "0 .5em" }}>;</span>
                    <Typography>Scenario: {risk.riskname}</Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            );
          })}
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ textTransform: "capitalize" }}
          >
            <AddIcon sx={{ height: "1rem", marginTop: "3px" }} />
            <Typography>Create new Risk Scenario</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Threat</InputLabel>
              <Select
                labelId="select-threat"
                id="select-threat"
                label="Threat"
                value={selectedThreat}
                color="secondary"
                onChange={(event) => {
                  setSelectedThreat(event.target.value);
                }}
              >
                {loadedTM.map(function renderThreats(threat) {
                  return (
                    <MenuItem value={threat.id} key={threat.id}>
                      {threat.threat.Threat}
                      <Typography
                        color="secondary"
                        sx={{ ml: ".5em", mr: ".5em", display: "inline" }}
                      >
                        @
                      </Typography>
                      {threat.targetedAsset.assetDisplayname}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText sx={{ mb: "1em" }}>
                The threat for which you wish to model the residual risk
              </FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              label="Scenario Name"
              required
              color="secondary"
              variant="outlined"
              helperText="Name the Strategic Risk"
              onChange={(e) => {
                setRiskName(e.target.value);
              }}
            />
            <Button variant="contained" onClick={handleSaveRisk} autoFocus>
              Save
            </Button>
            <Impacts threat={selectedThreat}></Impacts>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}

const NumberInput = forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { slots, ...other } = props;
  return (
    <BaseInput
      slots={{
        root: InputRoot,
        input: InputElement,
        ...slots,
      }}
      {...other}
      ref={ref}
    />
  );
});

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};
const InputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  display: flex;
  align-items: center;
  justify-content: center;


  &.${inputClasses.focused} {
    border-color: #8278d9;
    box-shadow: 0 0 0 3px #8278d9;
  }

  &:hover {
    border-color: #8278d9;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const InputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  flex-grow: 1;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);


const InputAdornment = styled('div')`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
