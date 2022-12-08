import './App.css';
import { useState, useEffect } from 'react';

import axios from "axios";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/system/Box';

import Button from '@mui/joy/Button';
import Tooltip from '@mui/material/Tooltip';
import Footer from "./Footer";


function App() {

  const [modelsValue, setModelsValue] = useState(['Meter', 'Meter & Qafya', 'Topic', 'Topic & Qafya']);
  const [metersValue, setMetersValue] = useState([]);
  const [topicsValue, setTopicsValue] = useState([]);
  const [qafyasValue, setQafyasValue] = useState([]);
  const [poemsValue, setPoemsValue] = useState([]);
  const [verses, setVerses] = useState();
  const [message, setMessage] = useState("pick more parameters | اختار مدخلات إضافية");
  
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
    setPoemIndex(0);
    if(poemsValue.length===0){
      setMessage("pick more parameters | اختار مدخلات إضافية");
    }
    else{
      setMessage("poems available: " + (poemIndex +1) +"/" + poemsValue.length);
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
    if(poemsValue.length===0){
      setMessage("pick more parameters | اختار مدخلات إضافية");
    }
    else{
      setMessage("poems available: " + (poemIndex +1) +"/" + poemsValue.length);
    }
  }, [poemIndex]);

  useEffect(() => {

    if(poemsValue.length===0){
      setMessage("pick more parameters | اختار مدخلات إضافية");
    }
    else{
      setMessage("poems available: " + (poemIndex +1) +"/" + poemsValue.length);
    }
  }, [poemsValue]);

  const getModels = () => {
    axios
    .get("https://apg-gptj-api-sk12.onrender.com/getModels")
    .then(response => {
      const models = response.data;
      setModelsValue(models);
      // console.log("Called2");
    })
    .catch(error => console.log(error));
    };

  const getMeters = () => {
    axios
    .get("https://apg-gptj-api-sk12.onrender.com/getMeters")
    .then(response => {
      const meters = response.data;
      setMetersValue(meters);
      // console.log("Called");
    })
    .catch(error => console.log(error));
  };
  const getTopics = () => {
    axios
    .get("https://apg-gptj-api-sk12.onrender.com/getTopics")
    .then(response => {
      const topics = response.data;
      setTopicsValue(topics);
      // console.log(topics);
    })
    .catch(error => console.log(error));
  };

  const getQafyas = () => {
    axios
    .get("https://apg-gptj-api-sk12.onrender.com/getQafyas")
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
    .get("https://apg-gptj-api-sk12.onrender.com/getPoemsOfMeterModel", {
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
    if(poemsValue.length===0){
      setMessage("pick more parameters | اختار مدخلات إضافية");
    }
    else{
      setMessage("poems available: " + (poemIndex+1) +"/" + poemsValue.length);
    }
  };

  return (
    <>
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
        <Box  margin='auto' textAlign={'center'} >
          <h1>GPT-J poems</h1>
          <p>Disclaimer: The poems shown here are pre-generated. The model currently isn't live.</p>
          <p>ملحوظة: الأشعار المعروضة أنتجها النموذج في وقت سابق</p>
        </Box>
        <Box gap={2} margin='auto' width={400} maxWidth ={500} display= {'flex'} flexWrap= {'wrap'} textAlign={'center'}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Model | النموذج</InputLabel>
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
            <InputLabel id="demo-simple-select-label">Meter | البحر</InputLabel>
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
            <InputLabel id="demo-simple-select-label">Topic | الموضوع</InputLabel>
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
            <InputLabel id="demo-simple-select-label">Qafya | القافية</InputLabel>
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
          <Box margin={'auto'} width={400} alignContent={'center'} color = "#ff5555">{message}</Box>
          <Box margin={'auto'}sx={{ color : "#ffffff", bgcolor:"#808080"}}>
            <Tooltip title= {message} arrow>
              <Button  tool variant="solid" disabled={false} onClick={getAnother}>view another poem | عرض شعر آخر</Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Box marginBottom={2} marginTop = {2}>
        <Footer />
      </Box>
    </>
  );
}

export default App;