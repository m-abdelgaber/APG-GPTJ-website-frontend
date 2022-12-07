import './App.css';
import { useState, useEffect } from 'react';

import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/system/Box';
import ThemeProvider from '@mui/system/ThemeProvider' 
import createTheme from '@mui/system/createTheme' 
import Button from '@mui/joy/Button';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      dark: '#009688',
    },
  },
});

function App() {

  const [modelsValue, setModelsValue] = useState([]);
  const [metersValue, setMetersValue] = useState([]);
  const [topicsValue, setTopicsValue] = useState([]);
  const [qafyasValue, setQafyasValue] = useState([]);
  const [poemsValue, setPoemsValue] = useState([]);
  const [verses, setVerses] = useState();

  const [poemIndex, setPoemIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedMeter, setSelectedMeter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedQafya, setSelectedQafya] = useState('');

  const [noMeter, setNoMeter] = useState(true);
  const [noTopic, setNoTopic] = useState(true);
  const [noQafya, setNoQafya] = useState(true);
  useEffect(() => {
    getMeters();
    getModels();
    getTopics();
    getQafyas();
  }, []);
  useEffect(() => {
    if(selectedModel ==='Meter' ){
      setNoMeter(false);
      setNoTopic(true);
      setSelectedTopic('');
      setNoQafya(true);
      setSelectedQafya('')
    }
    else if(selectedModel ==='Topic' ){
      setNoMeter(true);
      setSelectedMeter('')
      setNoTopic(false);
      setNoQafya(true);
      setSelectedQafya('')
    }
    else if(selectedModel ==='Meter & Qafya' ){
      setNoMeter(false);
      setNoTopic(true);
      setSelectedTopic('')
      setNoQafya(false);
    }
    else if(selectedModel ==='Topic & Qafya' ){
      setNoMeter(true);
      setSelectedMeter('')
      setNoTopic(false);
      setNoQafya(false);
    }
    setVerses();
    setPoemIndex(0);
  }, [selectedModel]);

  useEffect(() => {
    // console.log("model changed")
    if(selectedModel !==''){
      getPoems();
      
    }
  }, [selectedModel, selectedMeter, selectedTopic, selectedQafya]);
  useEffect(() => {
    
    if(selectedModel!=='' ){
      var splitted = poemsValue[poemIndex].split("\n");
      var formatted=[];
      // console.log(splitted);
      for (var i=0;i<splitted.length-1;i+=2){
        formatted[i/2] = splitted[i]+ " ... " +splitted[i+1];
      }
      setVerses(formatted.map((verse) =>
      <p>{verse}</p>
      ))
      
    }
  }, [poemIndex]);

  const getModels = () => {
    axios
    .get("http://localhost:3001/getModels")
    .then(response => {
      const models = response.data;
      setModelsValue(models);
      // console.log("Called2");
    })
    .catch(error => console.log(error));
    };

  const getMeters = () => {
    axios
    .get("http://localhost:3001/getMeters")
    .then(response => {
      const meters = response.data;
      setMetersValue(meters);
      // console.log("Called");
    })
    .catch(error => console.log(error));
  };
  const getTopics = () => {
    axios
    .get("http://localhost:3001/getTopics")
    .then(response => {
      const topics = response.data;
      setTopicsValue(topics);
      // console.log(topics);
    })
    .catch(error => console.log(error));
  };

  const getQafyas = () => {
    axios
    .get("http://localhost:3001/getQafyas")
    .then(response => {
      const qafyas = response.data;
      setQafyasValue(qafyas);
      // console.log(qafyas);
    })
    .catch(error => console.log(error));
  };

  const getPoems = () => {
    // console.log("here");
    axios
    .get("http://localhost:3001/getPoemsOfMeterModel", {
        params: {
          meter: selectedMeter,
          model: selectedModel,
          topic: selectedTopic,
          qafya: selectedQafya,
        }
      }
    )
    .then(response => {
      const poems = response.data;
      // console.log(poems.length);
      setPoemsValue(poems);
      var splitted = poems[poemIndex].split("\n");
      var formatted=[];
      // console.log(splitted);
      for (var i=0;i<splitted.length-1;i+=2){
        formatted[i/2] = splitted[i]+ " ... " +splitted[i+1]; 
      }
      // console.log(formatted);

      setVerses(formatted.map((verse) =>
      <p>{verse}</p>
      ))
    })
    .catch(error => console.log(error));
    };

  const handleChangeModel = (e) => {
    // console.log(e.target.value);
    setSelectedModel(e.target.value);
  };
  const handleChangeMeter = (e) => {
    // console.log(e.target.value);
    setSelectedMeter(e.target.value);
  };
  const handleChangeTopic = (e) => {
    // console.log(e.target.value);
    setSelectedTopic(e.target.value);
  };
  const handleChangeQafya = (e) => {
    // console.log(e.target.value);
    setSelectedQafya(e.target.value);
  };

  const modelsList = modelsValue.map((model) =>
    <MenuItem key={model} value = {model}>{model}</MenuItem>
  );

  const metersList = metersValue.map((meter) =>
    <MenuItem key={meter} value = {meter}>{meter}</MenuItem>
  );
  
  const topicsList = topicsValue.map((topic) =>
    <MenuItem key={topic} value = {topic}>{topic}</MenuItem>
  );
  
  const qafyasList = qafyasValue.map((qafya) =>
    <MenuItem key={qafya} value = {qafya}>{qafya}</MenuItem>
  );

  const getAnother = (e) => {
    const limit = (poemsValue.length=== 0)?1:poemsValue.length;
    setPoemIndex((poemIndex+1)%limit);
  };

  return (
    <Box margin='auto' sx={{display: 'flex', gap: 2, flexWrap: 'wrap' ,minWidth: 120 , maxWidth: 600}}>
      <Box
      margin={'auto'}
      component="img"
      sx={{
        height: 115,
        width: 250,
        minWidth: 125 ,
        maxWidth: 500
      }}
      alt="GUC logo"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/German_University_in_Cairo_Logo.jpg/1920px-German_University_in_Cairo_Logo.jpg"
      />
      <Box  margin='auto' ><h1>View GPT-J generated poetry</h1></Box>
      <Box gap={2} margin='auto' width={400} maxWidth ={500} display= {'flex'} flexWrap= {'wrap'} textAlign={'center'}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Model</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedModel}
            label="Model"
            onChange={handleChangeModel}
          >
            {modelsList}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled = {noMeter}>
          <InputLabel id="demo-simple-select-label">Meter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedMeter}
            label="Meter"
            onChange={handleChangeMeter}
          >
            {metersList}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled ={noTopic}>
          <InputLabel id="demo-simple-select-label">Topic</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedTopic}
            label="Topic"
            onChange={handleChangeTopic}
          >
            {topicsList}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={noQafya}>
          <InputLabel id="demo-simple-select-label">Qafya</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedQafya}
            label="Qafya"
            onChange={handleChangeQafya}
          >
            {qafyasList}
          </Select>
        </FormControl>
      
        <Box margin={'auto'} width={400} alignContent={'center'}>{verses}</Box>
        
        <Box margin={'auto'}sx={{ color : "#ffffff", bgcolor:"#808080"}}>
          <Button variant="solid" disabled={false} onClick={getAnother}>view another poem</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default App;