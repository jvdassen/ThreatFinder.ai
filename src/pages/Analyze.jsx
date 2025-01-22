import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions';
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Switch } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { Typography } from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import NativeSelect from '@mui/material/NativeSelect';
import { useState, useEffect } from "react";

import {
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  List,
  InputLabel,
} from "@mui/material";
import assetTaxonomy from "./AssetTaxonomy.json";
import threatTaxonomy from "./ThreatTaxonomy.json";

export default Analyze;

function Analyze({ onNrThreats }) {
  const [jsonData, setJsonData] = useState(threatTaxonomy);
  const [selectedThreatTaxonomy, setSelectedThreatTaxonomy] = useState("");

  var [selectedModel] = useState(localStorage.getItem("selectedModel") || "");
  try {
    var loaded = JSON.parse(localStorage.getItem("storedModels")) || [];
  } catch (e) {
    loaded = [];
  }
  var storedModels = loaded;
  var [selectedModelInfo] = useState(
    storedModels.find((m) => m.id === selectedModel)
  );

  var diagram = selectedModelInfo.diagram;
  var [detectedAssets] = useModeledAssets(diagram, assetTaxonomy);

  selectedModelInfo.assets = detectedAssets;
  localStorage.setItem("storedModels", JSON.stringify(storedModels));

  try {
    var loadedTM =
      JSON.parse(localStorage.getItem("threatModels"))[selectedModel] || [];
  } catch (e) {
    loadedTM = [];
  }

  var [threatModel, setThreatModel] = useState(loadedTM);
  onNrThreats(threatModel.length);

  function addToThreatModel(newThreat) {
    threatModel.push(newThreat);
    setThreatModel([...threatModel]);
    var storedThreatModels =
      JSON.parse(localStorage.getItem("threatModels")) || {};
    storedThreatModels[selectedModel] = threatModel;
    localStorage.setItem("threatModels", JSON.stringify(storedThreatModels));
    onNrThreats(threatModel.length);
  }

  var keyProp = selectedModelInfo.keyProp;
  const [propFilter, setPropFilter] = useState({
    Confidentiality: keyProp === "Confidentiality",
    Integrity: keyProp === "Integrity",
    Availability: keyProp === "Availability",
    Accountability: keyProp === "Accountability",
    "Business Understanding": true,
    "Business Goal Definition": true,
    "Data Pre-processing": true,
    "Model Tuning": true,
    "Feature Selection": true,
    "Data Exploration": true,
    "Data Ingestion": true,
    "Model Training": true,
    "Model Selection": true,
    "Model Building": true,
    "Model Deployment": true,
    "Model Maintenance": true,
    "Transfer Learning": true,
    Actor: true,
    Data: true,
    Model: true,
    Artefacts: true,
    Processes: true,
    "Environment/tools": true,
  });

  function updatePropFilter(newState) {
    setPropFilter({ ...newState });
  }

  window.assetTaxonomy = assetTaxonomy;

  useEffect(() => {
    if (!selectedThreatTaxonomy) {
      setJsonData(threatTaxonomy);
      // setError(null);
      return;
    }

    const importJsonFile = async (fileName) => {
      try {
        const response = await import(`./ThreatTaxonomy-${fileName}.json`);
        setJsonData(response.default);
        // setError(null);
      } catch (err) {
        // setError(`Error loading ${fileName}.json: ${err.message}`);
        setJsonData(threatTaxonomy);
      }
    };

    importJsonFile(selectedThreatTaxonomy);
  }, [selectedThreatTaxonomy]);

  const handleThreatTaxonomyChange = (event) => {
    setSelectedThreatTaxonomy(event.target.value);
  };

  function getThreatsforCategory(category) {
    // var threats = threatTaxonomy.filter((t) =>
    //   t["Affected assets"].includes(category)
    // );
    var threats = jsonData.filter((t) =>
      t["Affected assets"].includes(category)
    );
    threats.map((t) => {
      return (t.potentialKeyThreat = t["Potential Impact"].includes(
        selectedModelInfo.keyProp
      ));
    });
    return threats;
  }

  function assetList(assets, selectedModelInfo) {
    assets.sort(function sortByStringAttribute(a, b) {
      return a.assetDisplayname.localeCompare(b.assetDisplayname);
    });

    // TODOD DELETE
    var potentialKeyAssets = assets.filter(
      (a) => a.assetCategory === selectedModelInfo.keyAsset
    );

    var nonCriticalAssets = assets.filter(
      (a) => a.assetCategory !== selectedModelInfo.keyAsset
    );
    //var notKeyAssetGroups = [...new Set(otherAssets.map(a => a.assetCategory))]

    function byCategory({ assetCategory }) {
      return assetCategory;
    }
    var nonCriticalAssetGroups = Object.values(
      Object.groupBy(nonCriticalAssets, byCategory)
    );

    function ThreatList(asset, category) {
      var threats = getThreatsforCategory(category);
      //console.log(`${asset.assetDisplayname} has ${threats.length} threats`, threats)
      return (
        <>
          {threats.map((k) => {
            var impacts = k["Potential Impact"].split(", ").some((i) => {
              return propFilter[i];
            });
            if (impacts) {
              return (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ textTransform: "capitalize" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{k.Threat}</span>
                      <span>
                        (
                        {k["Potential Impact"]
                          .split(", ")
                          .map((i) => i.split("")[0])}
                        )
                      </span>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {k.Description}
                    <AccordionActions>
                      <Button
                        color="secondary"
                        onClick={(e) => {
                          addToThreatModel({
                            id: Math.random() * 1e17,
                            threat: k,
                            targetedAsset: asset,
                            controls: [],
                          });
                        }}
                      >
                        Add to Threat Model
                      </Button>
                    </AccordionActions>
                  </AccordionDetails>
                </Accordion>
              );
            }
            return null;
          })}
        </>
      );
    }

    function assetGroup(group, groupIsKey) {
      // should all be the same, check the first
      var category = group[0]?.assetCategory;
      console.log(category);
      if (propFilter[category] && category) {
        return (
          <>
            <Paper sx={{ p: "1em" }} elevation={groupIsKey ? 0 : 0}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  mb: "1em",
                }}
              >
                {groupIsKey && <ArrowRightAltIcon color="secondary" />}
                <Typography
                  variant="h5"
                  sx={{ fontStyle: "italic", textTransform: "capitalize" }}
                >
                  {category.replace("/", " & ")}
                </Typography>
              </Box>
              {groupIsKey && (
                <Typography>
                  These threats may impact or relate to a key asset.
                </Typography>
              )}
              {group.map((asset) => {
                if (
                  asset.assetLifeCycleStage.split(", ").some(function (stage) {
                    if (asset.assetDisplayname === "Train Model") debugger;
                    var stageEnabled = propFilter[stage];
                    return stageEnabled;
                  })
                ) {
                  //  console.log(asset, 'should be displayed', asset.assetLifeCycleStage)

                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {asset.assetDisplayname}
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ minWidth: "35ch", maxWidth: "35ch" }}>
                            <Typography sx={{ opacity: ".6", mb: "1em" }}>
                              {asset.assetLifeCycleStage.split(", ").join("—")}
                            </Typography>
                            <Typography sx={{ fontStyle: "italic", mb: "1em" }}>
                              "{asset.assetDescription}"
                            </Typography>
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            {ThreatList(asset, category)}
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                } else {
                  //console.log(asset, 'should NOT be displayed', asset.assetLifeCycleStage)
                  return null;
                }
              })}
            </Paper>
          </>
        );
      }
    }

    return (
      <>
        {assetGroup(potentialKeyAssets, true)}
        {nonCriticalAssetGroups.map((group) => {
          return assetGroup(group, false);
        })}
      </>
    );
  }

  function handlePropChange(event) {
    var propChanged = event.target.name;
    propFilter[propChanged] = !propFilter[propChanged];
    updatePropFilter(propFilter);
  }
  function handleAssetChange(event) {
    var propChanged = event.target.name;
    propFilter[propChanged] = !propFilter[propChanged];
    updatePropFilter(propFilter);
  }

  return (
    <>
      <Typography level="title-lg" variant="h4">
        Threat Analysis
      </Typography>
      <Typography variant="subtitle">
        Identify the Threats Surrouding Your Assets
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<TuneRoundedIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ textTransform: "capitalize", mt: "1em" }}
        >
          Filters
        </AccordionSummary>
        <AccordionDetails>
          Automated threat identification easily produces false positives (
          <i>i.e.,</i> irrelevant threats).
          <br /> Apply filters to investigate threats from different angles —
          the initial selection reflects the previously defined key asset and
          security property.
          {propFilter.Confidentiality}
          <Box sx={{ display: "flex" }}>
            <Box sx={{ maxHeight: "13em", p: "1em" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">
                  Security Properties
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter.Confidentiality}
                        onChange={handlePropChange}
                        name="Confidentiality"
                        color="secondary"
                      />
                    }
                    label="Confidentiality"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter.Integrity}
                        onChange={handlePropChange}
                        name="Integrity"
                        color="secondary"
                      />
                    }
                    label="Integrity"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter.Availability}
                        onChange={handlePropChange}
                        name="Availability"
                        color="secondary"
                      />
                    }
                    label="Availability"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter.Accountability}
                        onChange={handlePropChange}
                        name="Accountability"
                        color="secondary"
                      />
                    }
                    label="Accountability"
                  />
                </FormGroup>
                <FormHelperText>
                  <span style={{ textTransform: "capitalize" }}>
                    {selectedModelInfo.keyProp} is your key property
                  </span>
                </FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: "12em", p: "1em", overflow: "scroll" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">
                  Design Stage
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Business Understanding"]}
                        onChange={handlePropChange}
                        name="Business Understanding"
                        color="secondary"
                      />
                    }
                    label="Business Understanding"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Business Goal Definition"]}
                        onChange={handlePropChange}
                        name="Business Goal Definition"
                        color="secondary"
                      />
                    }
                    label="Business Goal Definition"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Data Pre-processing"]}
                        onChange={handlePropChange}
                        name="Data Pre-processing"
                        color="secondary"
                      />
                    }
                    label="Data Pre-processing"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Tuning"]}
                        onChange={handlePropChange}
                        name="Model Tuning"
                        color="secondary"
                      />
                    }
                    label="Model Tuning"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Feature Selection"]}
                        onChange={handlePropChange}
                        name="Feature Selection"
                        color="secondary"
                      />
                    }
                    label="Feature Selection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Data Exploration"]}
                        onChange={handlePropChange}
                        name="Data Exploration"
                        color="secondary"
                      />
                    }
                    label="Data Exploration"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Data Ingestion"]}
                        onChange={handlePropChange}
                        name="Data Ingestion"
                        color="secondary"
                      />
                    }
                    label="Data Ingestion"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Training"]}
                        onChange={handlePropChange}
                        name="Model Training"
                        color="secondary"
                      />
                    }
                    label="Model Training"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Selection"]}
                        onChange={handlePropChange}
                        name="Model Selection"
                        color="secondary"
                      />
                    }
                    label="Model Selection"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Building"]}
                        onChange={handlePropChange}
                        name="Model Building"
                        color="secondary"
                      />
                    }
                    label="Model Building"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Deployment"]}
                        onChange={handlePropChange}
                        name="Model Deployment"
                        color="secondary"
                      />
                    }
                    label="Model Deployment"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model Maintenance"]}
                        onChange={handlePropChange}
                        name="Model Maintenance"
                        color="secondary"
                      />
                    }
                    label="Model Maintenance"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Transfer Learning"]}
                        onChange={handlePropChange}
                        name="Transfer Learning"
                        color="secondary"
                      />
                    }
                    label="Transfer Learning"
                  />
                </FormGroup>
                <FormHelperText></FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: "12em", p: "1em", overflow: "scroll" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" color="secondary">
                  Asset Type
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Actor"]}
                        onChange={handleAssetChange}
                        name="Actor"
                        color="secondary"
                      />
                    }
                    label="Actor"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Data"]}
                        onChange={handleAssetChange}
                        name="Data"
                        color="secondary"
                      />
                    }
                    label="Data"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Model"]}
                        onChange={handleAssetChange}
                        name="Model"
                        color="secondary"
                      />
                    }
                    label="Model"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Artefacts"]}
                        onChange={handleAssetChange}
                        name="Artefacts"
                        color="secondary"
                      />
                    }
                    label="Artefacts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Processes"]}
                        onChange={handleAssetChange}
                        name="Processes"
                        color="secondary"
                      />
                    }
                    label="Processes"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={propFilter["Environment/Tools"]}
                        onChange={handleAssetChange}
                        name="Environment/Tools"
                        color="secondary"
                      />
                    }
                    label="Environment & Tools"
                  />
                </FormGroup>
                <FormHelperText></FormHelperText>
              </FormControl>
            </Box>
            <Box sx={{ maxHeight: "12em", p: "1em", overflow: "scroll" }}>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Knowledge Base
                </InputLabel>
                <NativeSelect
                  defaultValue={"enisa"}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                  onChange={handleThreatTaxonomyChange}
                >
                  <option value={"enisa"}>ENISA AI Landscape</option>
                  <option value={"owasp"}>OWASP AI Exchange</option>
                  <option value={"mitre"}>MITRE Atlas</option>
                  <option value={"aws"}>AWS GenAI Threat Pack</option>
                </NativeSelect>
              </FormControl>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <ThreatModel threatModel={threatModel}></ThreatModel>
      {assetList(detectedAssets, selectedModelInfo)}
    </>
  );
}

export function ThreatModel (props) {
  var {threatModel} = props
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<NotesRoundedIcon />}
        sx={{ textTransform: 'capitalize' }}>
        Threat Model {threatModel.length > 0 ? `(${threatModel.length})` : '(empty)' }
      </AccordionSummary>
      <AccordionDetails>
        <List>
          { threatModel.map(function renderThreat (threat) {
            console.log(threat)
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ textTransform: 'capitalize' }}>
                  "{threat.threat.Threat}"
                  <Typography color="secondary" sx={{ml: '.5em', mr: '.5em'}}>@</Typography>
                  "{threat.targetedAsset.assetDisplayname}" 
                  <ArrowRightAltIcon color="secondary" sx={{ml: '.5em', mr: '.5em'}}/>
                  {threat.threat['Potential Impact']}
                </AccordionSummary>

                <AccordionDetails>
                  <Typography><span style={{fontStyle: 'italic', marginRight: '1em', opacity: '.5'}}>DESCRIPTION</span>{threat.threat.Description}</Typography>
                  <Typography><span style={{fontStyle: 'italic', marginRight: '1em', opacity: '.5'}}>CATEGORY</span>{threat.threat['Threat Category']}</Typography> <Typography><span style={{fontStyle: 'italic', marginRight: '1em', opacity: '.5'}}>ASSET</span>{threat.targetedAsset['assetDisplayname']} </Typography>
                  <Typography><span style={{fontStyle: 'italic', marginRight: '1em', opacity: '.5'}}>ASSET CATEGORY</span>{threat.targetedAsset['assetCategory']}</Typography>
                  <Typography><span style={{fontStyle: 'italic', marginRight: '1em', opacity: '.5'}}>ASSET LIFE CYCLE</span>{threat.targetedAsset.assetLifeCycleStage}</Typography>
                </AccordionDetails>
              </Accordion>
            )})
          }
        </List>
      </AccordionDetails>
    </Accordion>
  )
}
function useModeledAssets(diagram, taxonomy) {
  var x = new DOMParser()
  var d = x.parseFromString(diagram.xml, 'text/xml')
  var a = [...d.querySelectorAll('[assetname]')]
  var [detectedAssets, setAsset] = useState(a.map(function(e) {
    var assetAttr = e.getAttribute('assetname')
    var labelAttr = e.getAttribute('label')
    var displayName = assetAttr

    if (assetAttr !== labelAttr) {
      displayName = `${assetAttr} (${labelAttr})`
    }

    var assetTaxonomyEntry = taxonomy.find(t => t.Asset === assetAttr)
    if (!assetTaxonomyEntry) {
      console.warn(`${assetAttr} not in asset taxonomy`)
      return {
        assetname: e.getAttribute('assetname'),
        assetDisplayname: displayName,
        assetDescription: 'N/A',
        assetLifeCycleStage: 'N/A',
        assetCategory: 'N/A'
      }
    }

    return {
      assetname: e.getAttribute('assetname'),
      assetDisplayname: displayName,
      assetDescription: assetTaxonomyEntry.Definition,
      assetLifeCycleStage: assetTaxonomyEntry['AI Lifecycle Stage'],
      assetCategory: assetTaxonomyEntry.Category
    }
  }))

  return [detectedAssets, setAsset]
}
