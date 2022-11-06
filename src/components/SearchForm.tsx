import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import styled from '@emotion/styled'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import { Autocomplete, Button, Box, Paper, TextField, Stack, CircularProgress } from '@mui/material'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { getDistance, getCitiesByKeyword, cities } from '../data/db'
import { valueToPercent } from '@mui/base';
interface City {
  Name: string,
  Latitude: number,
  Longitude: number,
}


function SearchForm() {
  const [intermediateCities, setIntermediateCities] = useState<any>([])
  const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));
  const navigate = useNavigate();
  const [originValue, setOriginValue] = useState('')
  const [showOriginCities, setShowOriginCities] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [originPopperText, setOriginPopperText] = useState('')
  const [options, setOptions] = React.useState<readonly City[]>([]);
  const [originLoading, setOriginLoading] = useState(false)


  useEffect(() => {
    setShowOriginCities(true)
    setOptions([])
    setTimeout(() => {
      setOptions(getCitiesByKeyword(originValue))
      setOriginLoading(false)
    }, 2000)
    options.length < 1 && setShowOriginCities(false)
    if (originValue.length > 0) {
      if (originValue.toLowerCase() == "fail") { setOriginPopperText(`Search failed`) }
      else { setOriginPopperText(`No cities found for " ${originValue} "`) }
    }
    else {
      setOriginPopperText(`Please enter a city name`)
    }
  }, [originValue])
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };
  // const options = ['The Godfather', 'Pulp Fiction'];

  const submitForm = () => {
    navigate("/results");
  }
  const addIntermediateCity = () => {
    let newIntermediateCity = {
      "dd": 0
    }
    setIntermediateCities([...intermediateCities, newIntermediateCity])
    console.log(intermediateCities)
  }
  const removeIntermediateCity = (key: any) => {
    setIntermediateCities(intermediateCities.filter((city: any, id: any) => id !== key))
  }

  const Title = styled.h1`
      margin:0;
      color:white;
      
      font-weight:"800px"
    `
  const Description = styled.p`
      margin:0;
      color:white;
    `


  return (
    <Paper elevation={3} sx={{ padding: "25px", backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(5px)", borderRadius: "10px", margin: "15px", textAlign: "center", display: "flex", flexDirection: "column" }}>
      <Box sx={{ background: 'transparent', padding: '0px', marginBottom: "25px" }}>
        <Title >Distance Calculator</Title>
        <Description>Calculate the distance of your trip between multiple locations with ease</Description>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box>
          <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 }}
            onInputChange={(e, inputValue: string) => {
              console.log(originValue)
              setOriginLoading(true)
              setOriginValue(inputValue)
              setOpen(true)
            }}
            onClose={() => {
              setOpen(false);
            }}
            
            clearIcon={<ClearIcon />}
            getOptionLabel={(option: any) => {
              if (originValue.length > 0) {
                return option.Name
              } else {
                return `No cities found for "${originValue}"`
              }
            }}
            options={options}
            forcePopupIcon={showOriginCities}
            loading={originLoading}
            noOptionsText={originPopperText}
            renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
            renderInput={(params) => (
              <TextField
                {...params}
                required 
                variant="filled"
                label="City of origin"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {originLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          {
            intermediateCities.map((intermediateCity: any, key: any) => {
              return (
                <Box sx={{
                  margin: "10px 0"
                }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    /* sx={{ width: 300 }} */
                    renderInput={(params) => <TextField variant="filled" {...params} label="Intermediate city" />}
                  />
                  <Button variant="outlined" onClick={() => removeIntermediateCity(key)} endIcon={<WrongLocationIcon />}>
                    Remove City
                  </Button>
                </Box>
              )
            })
          }
          <Button sx={{ marginBottom: "5px" }} variant="outlined" onClick={addIntermediateCity} endIcon={<AddLocationAltIcon />}>
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
        <Button onClick={submitForm} type='submit' sx={{ width: "100%", marginTop: "20px !important", letterSpacing: "2px", fontWeight: "700" }} variant="contained" endIcon={<SendIcon />}>
          Calculte Distance
        </Button>
      </Box>




    </Paper>
  )
}

export default SearchForm