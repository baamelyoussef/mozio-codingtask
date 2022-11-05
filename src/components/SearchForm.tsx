import React,{useState} from 'react'
import dayjs from 'dayjs';
import styled from '@emotion/styled'
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete,Button,Box,Paper,TextField,Stack } from '@mui/material'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider ,DesktopDatePicker } from '@mui/x-date-pickers';
import {getDistance,getCitiesByKeyword,cities} from '../data/db'

function SearchForm() {
  const [intermediateCities, setIntermediateCities] = useState<any>([])
  const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));
  const navigate = useNavigate();
  console.log(cities)
  const handleChange = (newValue:any) => {
    setValue(newValue);
  };
  const options = ['The Godfather', 'Pulp Fiction'];

  const submitForm=()=>{
    navigate("/results");
  }
  const addIntermediateCity=()=>{
    let newIntermediateCity={
      "dd":0
    }
    setIntermediateCities([...intermediateCities,newIntermediateCity])
    console.log(intermediateCities)
  }
  const removeIntermediateCity=(key:any)=>{    
    setIntermediateCities(intermediateCities.filter((city:any,id:any) => id !== key))
  }
  /* Distance between two lat/lng coordinates in km using the Haversine formula */
    // function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
    //   if (typeof miles === "undefined"){miles=false;}
    //   function deg2rad(deg){return deg * (Math.PI/180);}
    //   function square(x){return Math.pow(x, 2);}
    //   var r=6371; // radius of the earth in km
    //   lat1=deg2rad(lat1);
    //   lat2=deg2rad(lat2);
    //   var lat_dif=lat2-lat1;
    //   var lng_dif=deg2rad(lng2-lng1);
    //   var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
    //   var d=2*r*Math.asin(Math.sqrt(a));
    //   if (miles){return d * 0.621371;} //return miles
    //   else{return d;} //return km
    // }
    const Title= styled.h1`
      margin:0;
      color:white;
      
      font-weight:"800px"
    `
    const Description= styled.p`
      margin:0;
      color:white;
    `
  return (
    <Paper elevation={3} sx={{padding:"25px",backgroundColor:"rgba(0, 0, 0, 0.2)",backdropFilter: "blur(5px)", borderRadius:"10px", margin:"15px",textAlign:"center",display:"flex",flexDirection:"column" }}>
      <Box  sx={{ background:'transparent', padding:'0px', marginBottom:"25px"}}>
        <Title >Distance Calculator</Title>
        <Description>Calculate the distance of your trip between multiple locations with ease</Description>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box>
        <Autocomplete
        fullWidth
        disablePortal
        id="combo-box-demo"
        options={options}
        /* sx={{ width: 300 }} */
        
        renderInput={(params) => <TextField required variant="filled" {...params}  label="City of origin" />}
      />
      {
        intermediateCities.map((intermediateCity:any,key:any)=>{
          return(
            <Box sx={{
              margin:"10px 0"
            }}>
            <Autocomplete
              fullWidth
              disablePortal
              id="combo-box-demo"
              options={options}
              /* sx={{ width: 300 }} */
              renderInput={(params) => <TextField  variant="filled" {...params} label="Intermediate city" />}
            /> 
            <Button variant="outlined"  onClick={()=>removeIntermediateCity(key)} endIcon={<WrongLocationIcon />}>
              Remove City
            </Button> 
            </Box>
          )
        })
      } 
      <Button sx={{marginBottom:"5px"}} variant="outlined" onClick={addIntermediateCity} endIcon={<AddLocationAltIcon />}>
        Add Intermediate City
      </Button> 
      <Autocomplete
      fullWidth
      
        disablePortal
        id="combo-box-demo"
        options={options}
        /* sx={{ width: 300 }} */
        renderInput={(params) => <TextField required variant="filled" {...params} label="City of destination" />}
      />

        </Box>
        <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          
          /* label="Date desktop" */
          inputFormat="MM/DD/YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField required fullWidth {...params} />}
        /></Stack></LocalizationProvider>
        </Box>
        <Box>
      <TextField required fullWidth placeholder='Number of passengers' type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />

        </Box>
        </Stack>
        <Box>
        <Button onClick={submitForm} type='submit' sx={{ width:"100%",marginTop:"20px !important",letterSpacing:"2px", fontWeight:"700"}} variant="contained" endIcon={<SendIcon />}>
  Calculte Distance
</Button>
        </Box>
      
      
      
        
    </Paper>
  )
}

export default SearchForm