import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import styled from '@emotion/styled'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete, Button, Box, Tooltip, Paper, TextField, Snackbar, Alert, Stack, CircularProgress, InputAdornment } from '@mui/material'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { getDistance, getCitiesByKeyword } from '../data/db'
import { valueToPercent } from '@mui/base';
import { KeyObject } from 'crypto';
interface City {
  Name: string,
  Latitude: number,
  Longitude: number,
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
function SearchForm(props: any) {
  const [buttonSubmitted, setButtonSubmitted] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isIntermediatesPreFilled, setIsIntermediatesPreFilled] = useState(searchParams.getAll('intermediatecities').length > 0?true:false)
  const [isDatePrefilled, setIsDatePrefilled] = useState(false)
  const [isPassengerPrefilled, setIsPassengerPrefilled] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(props.readOnly)
  const [isOriginEmpty, setisOriginEmpty] = useState<boolean>(false)
  const [isDestinationEmpty, setisDestinationEmpty] = useState<boolean>(false)
  const [isIntermediateEmpty, setisIntermediateEmpty] = useState<boolean[]>([])
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [intermediateCityCombos, setIntermediateCityCombos] = useState<Array<City[]>>(
    // searchParams.getAll("intermediatecities").length>0?new Array(searchParams.getAll("intermediatecities").length).fill([]):
    [])
  const [datevalue, setDateValue] = useState(isReadOnly ? dayjs(new Date(searchParams.getAll("date")[0])) : dayjs(new Date()));
  const navigate = useNavigate();
  const [passengerNumber, setPassengerNumber] = useState(searchParams.getAll('passengers')[0]?searchParams.getAll('passengers')[0]:0)
  /*OriginStates */
  const [originValue, setOriginValue] = useState(
    // searchParams.get('origincity')?searchParams.getAll('origincity')[0]:

    '')
  const [isOriginPreFilled, setIsOriginPreFilled] = useState(false)
  const [showOriginCities, setShowOriginCities] = useState(false)
  const [originInputValue, setOriginInputValue] = useState(
    // searchParams.get('origincity')?searchParams.getAll('origincity')[0]:
    '')
  const [selectedOrigin, setSelectedOrigin] = useState<City>()
  const [originPopperText, setOriginPopperText] = useState('')
  const [isFormInvalid, setIsFormInvalid] = useState(true)
  const [originopen, setoriginOpen] = useState(false);
  const [originoptions, setoriginOptions] = useState<readonly City[]>([]);
  const [originLoading, setOriginLoading] = useState(false)
  /*DestinationStates */
  const [destinationValue, setdestinationValue] = useState(
    // searchParams.get('destinationcity')?searchParams.getAll('destinationcity')[0]:
    '')
  const [isDestinationPreFilled, setIsDestinationPreFilled] = useState(false)
  const [showdestinationCities, setShowdestinationCities] = useState(false)
  const [selecteddestination, setSelecteddestination] = useState<City>()
  const [destinationPopperText, setdestinationPopperText] = useState('')
  const [destinationopen, setdestinationOpen] = useState(false);
  const [destinationoptions, setdestinationOptions] = useState<readonly City[]>([]);
  const [destinationLoading, setdestinationLoading] = useState(false)
  /*IntermidateStates */
  const [intermediateIndex, setIntermediateIndex] = useState<number>(0)
  const [intermediateValues, setintermediateValues] = useState<Array<string>>(searchParams.getAll('intermediatecities').length > 0 ? searchParams.getAll('intermediatecities') : [])
  const [showintermediateCitiesCombos, setShowintermediateCitiesCombos] = useState<Array<boolean>>([])
  const [showintermediateCities, setShowintermediateCities] = useState<Array<boolean>>([])
  const [selectedIntermediates, setSelectedIntermediates] = useState<Array<City>>([])
  const [intermediatePopperTexts, setintermediatePopperTexts] = useState<Array<string>>([])
  const [intermediateOpenStates, setintermediateOpenStates] = useState<Array<boolean>>([]);
  const [IntermediateOptions, setIntermediateOptions] = useState<Array<City[]>>([]);
  const [intermediateLoadings, setintermediateLoadings] = useState<Array<boolean>>([])
  useEffect(() => {
    
    // console.log("test")
    if (searchParams.getAll('origincity').length > 0) {
      setIsOriginPreFilled(true)
      setOriginValue(searchParams.getAll('origincity')[0])
      let selectedOriginParam: City = getCitiesByKeyword(searchParams.getAll('origincity')[0])[0]
      setSelectedOrigin(selectedOriginParam)
    }
    if (searchParams.getAll('intermediatecities').length > 0) {
      setIsIntermediatesPreFilled(true)
      setIntermediateCityCombos(new Array(searchParams.getAll('intermediatecities').length).fill([])) 
      // setOriginValue(searchParams.getAll('origincity')[0])
      // let selectedOriginParam: City = getCitiesByKeyword(searchParams.getAll('origincity')[0])[0]
      // setSelectedOrigin(selectedOriginParam)
    }
    if (searchParams.getAll('destinationcity').length > 0) {
      setIsDestinationPreFilled(true)
      setdestinationValue(searchParams.getAll('destinationcity')[0])
      let selectedDestinationParam: City = getCitiesByKeyword(searchParams.getAll('destinationcity')[0])[0]
      setSelecteddestination(selectedDestinationParam)
    } 
    if (searchParams.getAll('passengers')[0]) {
      setIsPassengerPrefilled(true)
    }
    if (searchParams.getAll('date')[0]) {
      setIsDatePrefilled(true)
    }
  }, [])
  useEffect(() => {
    if (intermediateValues.length < 1) {
      if (searchParams.getAll('intermediatecities').length < 1) {

        let newIntermediateValues: string[] = intermediateCityCombos.map((e, index: number) => {
          return ''
        })
        setintermediateValues(newIntermediateValues)
      }
      console.log(intermediateValues)
    }
  }, [intermediateCityCombos])
  
  // console.log(selectedIntermediates)
  const isFormValid = () => {
    let areIntermediateValid: boolean = true
    let isInterEmpty: boolean[] = intermediateCityCombos.map((e, index: number) => {
      return false
    })
    if (!originValue || !selectedOrigin) {
      setisOriginEmpty(true)
    }
    if (intermediateCityCombos.length > 0) {
      intermediateValues.map((intermediateValue: string, index: number) => {

        if (intermediateValue.length < 2 || !selectedIntermediates[index]) {
          isInterEmpty = isInterEmpty.map((isIntermediateEmpty: boolean, key: number) => {
            if (index == key) {
              return true
            } else {
              return isIntermediateEmpty
            }
          })
        }
      })
      setisIntermediateEmpty(isInterEmpty)
      areIntermediateValid = isIntermediateEmpty.every((isIE) => isIE == true)

    }
    console.log(isIntermediateEmpty)
    if (!destinationValue || !selecteddestination) {
      setisDestinationEmpty(true)
    }
    if (!isDestinationEmpty && !isOriginEmpty && areIntermediateValid) {
      return true
    } else {
      return false
    }
  }
  useEffect(() => {
    if(!isIntermediatesPreFilled &&searchParams.getAll('intermediatecities').length > 0){

        let newIntermediateValues: string[] = intermediateCityCombos.map((e, index: number) => {
          return''
        })
        setintermediateValues(newIntermediateValues)
    }
  }, [isIntermediatesPreFilled])
  
  const submitForm = () => {
    if (isFormValid()) {
      setButtonSubmitted(true)
      let selectedIntermediateCities = selectedIntermediates.map((selectedIntermediate) => {
        return selectedIntermediate.Name
      })
      if (selectedIntermediates && selectedOrigin && selecteddestination && datevalue && passengerNumber) {
        setSearchParams({
          origincity: selectedOrigin.Name,
          destinationcity: selecteddestination.Name,
          date: dayjs(datevalue).format('YYYY-MM-DDTHH:mm:ss').toString(),
          intermediatecities: selectedIntermediateCities,
          passengers: passengerNumber.toString()
        })

      }
      setTimeout(() => {
        navigate(`/results${window.location.search}`);
      }, 2000);
    } else {
      setIsSnackbarOpen(true)
      setTimeout(() => {
        setIsSnackbarOpen(false)

      }, 3000);
    }
  }
  


  const handleChangeIntermediate = (inputV: string) => {
    let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
      return []

    })
    setIntermediateOptions(newIntermediateOptions)
    let newIntermediateLoadings = intermediateCityCombos.map((e, index: number) => {
      if (intermediateIndex == index) {
        return true
      } else {
        return false
      }
    })
    setintermediateLoadings(newIntermediateLoadings)

    let newIntermediateOpenStates = intermediateCityCombos.map((e, index: number) => {
      if (intermediateIndex == index) {
        return true
      } else {
        return false
      }
    })
    setintermediateOpenStates(newIntermediateOpenStates)
    let newIntermediateValues: string[] = intermediateCityCombos.map((e, index: number) => {
      if (intermediateIndex == index) {
        return inputV
      } else {
        return intermediateValues[index] ? intermediateValues[index] : ''
      }
    })
    setintermediateValues(newIntermediateValues)
    setTimeout(() => {
      
      let newIntermediateOptions: Array<City[]> = intermediateCityCombos.map((IntermediateOption, index: number) => {
        if (index == intermediateIndex) {
          return getCitiesByKeyword(inputV)
        } else {
          return []
        }
      })
      setIntermediateOptions(newIntermediateOptions)
      let newIntermediateLoadingsAfterSet = intermediateCityCombos.map((e, index: number) => {
        if (intermediateIndex == index) {
          return false
        } else {
          return false
        }
      })
      setintermediateLoadings(newIntermediateLoadingsAfterSet)
      // let newintermediatePopperTexts: string[] = intermediateCityCombos.map((intermediatePopperText, index: number) => {
      //   if (intermediateIndex == index) {
      //     console.log(intermediateValues)
      //       if (intermediateValues[index].toLowerCase() == "fail") { return (`Search failed`) }
      //       else { return (`No cities found for "${intermediateValues[index]}"`) }
          
      //   } else {
      //     return `Please enter a city name`
      //   }
      // })
      // setintermediatePopperTexts(newintermediatePopperTexts)
    }, 2000);





  }
  const handleSelectIntermediate = (selectedC: City) => {
    let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
      return []

    })
    setIntermediateOptions(newIntermediateOptions)
    let newselectedIntermediates = intermediateCityCombos.map((selectedVal: any, index: number) => {
      if (intermediateIndex == index) {
        return selectedC
      } else {
        return selectedIntermediates[index]
      }
    })

    setSelectedIntermediates(newselectedIntermediates)
  }

  useEffect(() => {
    /*Form validation */
    if ( passengerNumber >0 && selectedOrigin&&selectedIntermediates&& selecteddestination ) {
      setIsFormInvalid(false)
    } else {
      setIsFormInvalid(true)
    }
    
  })

  useEffect(() => {
    setisOriginEmpty(false)
    setShowOriginCities(true)
    setoriginOptions([])
    setOriginLoading(true)
    setTimeout(() => {
      setoriginOptions(getCitiesByKeyword(originValue))
      setOriginLoading(false)
    }, 2000)
    originoptions.length < 1 && setShowOriginCities(false)
    if (originValue.length > 0) {
      if (originValue.toLowerCase() == "fail") { setOriginPopperText(`Search failed`) }
      else { setOriginPopperText(`No cities found for "${originValue}"`) }
    }
    else {
      setOriginPopperText(`Please enter a city name`)
    }
  }, [originValue])


  useEffect(() => {

    let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
      return []

    })
    setIntermediateOptions(newIntermediateOptions)
  }, [intermediateCityCombos])

  
  useEffect(() => {
    // let newIntermediateOptions: Array<City[]> = IntermediateOptions.map((IntermediateOption, index: number) => {
    //   if (intermediateIndex == index) {
    //     return []
    //   } else {
    //     return IntermediateOption
    //   }
    // })
    // console.log(IntermediateOptions)
    // setIntermediateOptions(newIntermediateOptions)
  }, [intermediateOpenStates]);
  useEffect(() => {
    if (!originopen) {
      setoriginOptions([]);
    }
  }, [originopen]);
  useEffect(() => {
    setisDestinationEmpty(false)
    setShowdestinationCities(true)
    setdestinationOptions([])
    setdestinationLoading(true)
    setTimeout(() => {
      setdestinationOptions(getCitiesByKeyword(destinationValue))
      setdestinationLoading(false)
    }, 2000)
    destinationoptions.length < 1 && setShowdestinationCities(false)
    if (destinationValue.length > 0) {
      if (destinationValue.toLowerCase() == "fail") { setdestinationPopperText(`Search failed`) }
      else { setdestinationPopperText(`No cities found for "${destinationValue}"`) }
    }
    else {
      setdestinationPopperText(`Please enter a city name`)
    }
  }, [destinationValue])
  useEffect(() => {
    if (!destinationopen) {
      setdestinationOptions([]);
    }
  }, [destinationopen]);

  const handleDatePickerChange = (newValue: any) => {
    setDateValue(newValue.$d);
    console.log(newValue.$d)
  };


  const addIntermediateCity = () => {
    let newIntermediateCity: City[] = new Array(1).fill([])
    setIntermediateCityCombos([...intermediateCityCombos, newIntermediateCity])
  }
  const removeIntermediateCity = (key: any) => {
    setIntermediateCityCombos(intermediateCityCombos.filter((city: any, id: any) => id !== key))
    let newSelectedIntermediates = selectedIntermediates
    newSelectedIntermediates.splice(key, 1)
    setSelectedIntermediates(newSelectedIntermediates)
  }



  return (
    <div>
      <Paper elevation={3} sx={{ padding: "25px", backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(5px)", borderRadius: "10px", margin: "15px", textAlign: "center", display: "flex", flexDirection: "column" }}>
        <Box sx={{ background: 'transparent', padding: '0px', marginBottom: "25px" }}>
          <Title >Distance Calculator</Title>
          <Description>Calculate the distance of your trip between multiple locations with ease</Description>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box>
            <Box sx={{ display: "flex" }}>
              <Autocomplete
                fullWidth
                disabled={isReadOnly || isOriginPreFilled}
                onInputChange={(e, inputValue: string) => {
                  if (!isOriginPreFilled) {

                    setOriginLoading(true)
                    setOriginValue(inputValue)
                    // setoriginOpen(true)
                  }
                }}
                onClose={() => {
                  setoriginOpen(false);
                }}
                onChange={(event, selectedValue: City) => {
                  setSelectedOrigin(selectedValue)
                }}
                clearIcon={<ClearIcon />}
                getOptionLabel={(option: any) => {
                  if (originValue.length > 0) {
                    return option.Name
                  } else {
                    // return `No cities found for "${originValue}"`
                  }
                }}
                options={originoptions}
                forcePopupIcon={showOriginCities}
                loading={originLoading}
                sx={{ width: { xs: "100%", sm: "200px" } }}
                value={selectedOrigin}
                inputValue={originValue}
                noOptionsText={originPopperText}
                renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="filled"
                    error={isOriginEmpty}
                    value={originInputValue}
                    label="City of origin"
                    autoComplete='off'
                    InputProps={{
                      ...params.InputProps,
                      autoComplete: 'off',
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
              {isOriginPreFilled && !isReadOnly && <Tooltip title="Edit"><Button ><EditIcon onClick={() => {
                setIsOriginPreFilled(false)
              }} /></Button></Tooltip>}</Box>
            {
              intermediateCityCombos.map((intermediateCombo: any, key: number) => {
                return (
                  <Box sx={{
                    margin: "10px 0"
                  }}>
                    <Autocomplete
                      fullWidth
                      disabled={isReadOnly||isIntermediatesPreFilled}
                      sx={{ width: { xs: "100%", sm: "200px" } }}
                      onOpen={() => {
                        let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
                          return []

                        })
                        setIntermediateOptions(newIntermediateOptions)
                        setIntermediateIndex(key)
                      }}
                      onLoad={() => {

                      }}
                      onInputChange={(e, inputValue: string) => {
                        if(!isIntermediatesPreFilled){
                          setIsIntermediatesPreFilled(false)
                        setintermediatePopperTexts([])
                        setIntermediateIndex(key)
                        handleChangeIntermediate(inputValue)}
                      }}
                      onClose={() => {
                        let newOpenStates = intermediateCityCombos.map((e, index: number) => {
                          return false
                        })
                        setintermediateOpenStates(newOpenStates)
                      }}
                      onChange={(event, selectedValue: City) => {
                        setIntermediateIndex(key)
                        handleSelectIntermediate(selectedValue)

                      }}
                      clearIcon={<ClearIcon />}
                      getOptionLabel={(option: City) => {
                        if (intermediateValues[key].length > 0) {
                          return option.Name
                        } else {
                          return `No cities found for "${intermediateValues[key]}"`
                        }

                      }}
                      inputValue={intermediateValues[key]}
                      value={selectedIntermediates[key]}
                      options={IntermediateOptions[key]}
                      forcePopupIcon={showintermediateCities[key]}
                      loading={intermediateLoadings[key]}
                      noOptionsText={intermediatePopperTexts[key]}
                      renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          variant="filled"
                          error={isIntermediateEmpty[key]}
                          label="Intermediate City"
                          autoComplete='off'
                          value={selectedIntermediates[key]}
                          InputProps={{
                            ...params.InputProps,
                            autoComplete: 'off',
                            endAdornment: (
                              <React.Fragment>
                                {intermediateLoadings[key] ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                    {!isReadOnly && <Button variant="outlined" onClick={() => removeIntermediateCity(key)} endIcon={<WrongLocationIcon />}>
                      Remove City
                    </Button>}
                  </Box>
                )
              })
            }
            {!isReadOnly &&<Box sx={{display:"flex"}}> <Button sx={{ marginBottom: "5px" }} variant="outlined" onClick={addIntermediateCity} endIcon={<AddLocationAltIcon />}>
              Add Intermediate City
            </Button>{isIntermediatesPreFilled && !isReadOnly && <Tooltip title="Edit"><Button ><EditIcon onClick={() => {
                setIsIntermediatesPreFilled(false)
              }} /></Button></Tooltip>}</Box>}
            <Box sx={{ display: "flex" }}><Autocomplete
              fullWidth
              sx={{ width: { xs: "100%", sm: "200px" } }}
              disabled={isReadOnly || isDestinationPreFilled}
              onInputChange={(e, inputValue: string) => {
                if (!isDestinationPreFilled) {

                  setdestinationLoading(true)
                  setdestinationValue(inputValue)
                  setdestinationOpen(true)
                }
              }}
              onClose={() => {
                setdestinationOpen(false);
              }}
              onChange={(event, selectedValue: City) => {
                setSelecteddestination(selectedValue)
                console.log(selectedValue)
              }}
              clearIcon={<ClearIcon />}
              getOptionLabel={(option: any) => {
                if(destinationValue.length > 0) {
                  return option.Name
                } else {
                  return `No cities found for "${destinationValue}"`
                }
              }}
              options={destinationoptions}
              forcePopupIcon={showdestinationCities}
              loading={destinationLoading}
              value={selecteddestination}
              inputValue={destinationValue}
              noOptionsText={destinationPopperText}

              renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={isDestinationEmpty}
                  required
                  autoComplete='off'
                  variant="filled"
                  label="City of Destination"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {destinationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />{isDestinationPreFilled && !isReadOnly && <Tooltip title="Edit"><Button ><EditIcon onClick={() => {
              setIsDestinationPreFilled(false)
            }} /></Button></Tooltip>}</Box>

          </Box>
          <Box>
            <Box sx={{display:"flex"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  minDate={new Date()}
                  disablePast
                  
                  
                  disabled={isReadOnly||isDatePrefilled}
                  /* label="Date desktop" */
                  inputFormat="DD/MM/YYYY"
                  value={isReadOnly || isDatePrefilled ? dayjs(new Date(searchParams.getAll("date")[0])) : datevalue}
                  onChange={handleDatePickerChange}
                  renderInput={(params) => <TextField sx={{ width: { xs: "100%", sm: "200px" } }} required fullWidth {...params} />}
                /></Stack></LocalizationProvider>{isDatePrefilled && !isReadOnly && <Tooltip title="Edit"><Button ><EditIcon onClick={() => {
                  setIsDatePrefilled(false)
                }} /></Button></Tooltip>}</Box>
          </Box>
          <Box>
            {/* <PersonIcon /> */}
           <Box sx={{display:"flex"}}><TextField
              required
              fullWidth
              sx={{ width: { xs: "100%", sm: "200px" } }}
              disabled={isReadOnly || isPassengerPrefilled}
              value={isReadOnly || isPassengerPrefilled ? searchParams.getAll("passengers")[0] : passengerNumber}
              onChange={(e) => { setPassengerNumber(Number(e.target.value)); console.log(passengerNumber) }}
              placeholder='Number of passengers' type="number" inputProps={{
                startadornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ), inputMode: 'numeric', min: "0", pattern: '[0-9]*',
              }} />
              {isPassengerPrefilled && !isReadOnly && <Tooltip title="Edit"><Button ><EditIcon onClick={() => {
              setIsPassengerPrefilled(false)
            }} /></Button></Tooltip>}</Box> 
          </Box>
        </Stack>
        {!isReadOnly && <Box>
          <LoadingButton loading={buttonSubmitted} onClick={submitForm} type='submit' sx={{ width: "100%", marginTop: "20px !important", letterSpacing: "2px", fontWeight: "700" }} variant="contained" endIcon={<SendIcon />} disabled={isFormInvalid}>
            Calculte Distance
          </LoadingButton>
        </Box>}



      </Paper>
      <Snackbar open={isSnackbarOpen} autoHideDuration={3000} >
        <Alert severity="error" sx={{ width: '100%' }}>
          Please fill the requested input
        </Alert>
      </Snackbar></div>
  )
}

export default SearchForm