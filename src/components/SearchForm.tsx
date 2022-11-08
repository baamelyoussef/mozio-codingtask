import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import styled from '@emotion/styled'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import { Autocomplete, Button, Box, Paper, TextField, Stack, CircularProgress, InputAdornment } from '@mui/material'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { getDistance, getCitiesByKeyword} from '../data/db'
import { valueToPercent } from '@mui/base';
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
function SearchForm(props:any) {
  const [buttonSubmitted, setButtonSubmitted] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [intermediateCityCombos, setIntermediateCityCombos] = useState<Array<City[]>>(
    // searchParams.getAll("intermediatecities").length>0?new Array(searchParams.getAll("intermediatecities").length).fill([]):
    [])

  const [datevalue, setDateValue] = useState(dayjs(new Date()));
  const navigate = useNavigate();
  const [passengerNumber, setPassengerNumber] = useState(0)
  /*OriginStates */
  const [originValue, setOriginValue] = useState(
    // searchParams.get('origincity')?searchParams.getAll('origincity')[0]:

  '')
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
  const [showdestinationCities, setShowdestinationCities] = useState(false)
  const [selecteddestination, setSelecteddestination] = useState<City>()
  const [destinationPopperText, setdestinationPopperText] = useState('')
  const [destinationopen, setdestinationOpen] = useState(false);
  const [destinationoptions, setdestinationOptions] = useState<readonly City[]>([]);
  const [destinationLoading, setdestinationLoading] = useState(false)
  /*IntermidateStates */
  const [intermediateIndex, setIntermediateIndex] = useState<number>(0)
  const [intermediateValues, setintermediateValues] = useState<Array<string>>(searchParams.getAll('intermediatecities').length>0?searchParams.getAll('intermediatecities'):[])
  const [showintermediateCitiesCombos, setShowintermediateCitiesCombos] = useState<Array<boolean>>([])
  const [showintermediateCities, setShowintermediateCities] = useState<Array<boolean>>([])
  const [selectedIntermediates, setSelectedIntermediates] = useState<Array<City>>([])
  const [intermediatePopperTexts, setintermediatePopperTexts] = useState<Array<string>>([])
  const [intermediateOpenStates, setintermediateOpenStates] = useState<Array<boolean>>([]);
  const [IntermediateOptions, setIntermediateOptions] = useState<Array<City[]>>([]);
  const [intermediateLoadings, setintermediateLoadings] = useState<Array<boolean>>([])
  useEffect(() => {
    if(intermediateValues.length<1 ){
      // if(searchParams.getAll('intermediatecities').length<1){
        
        let newIntermediateValues: string[] = intermediateCityCombos.map((e, index: number) => {
          return ''
        })
        setintermediateValues(newIntermediateValues)
      // }else{
        // console.log("test")
      //  setOriginValue()
      //  setdestinationValue(searchParam.get('destinationcity'))
      let selectedParamOptions:Array<City>= searchParams.getAll('intermediatecities').map((intermediateCity)=>{
       return getCitiesByKeyword(intermediateCity)[0]
      })
      setSelectedIntermediates(selectedParamOptions)
       
      // }
    }
    
    const newInputVal=searchParams.get("origincity")
      // setOriginInputValue(searchParams.get("origincity").toString())
    
    
    }, [])
    // console.log(selectedIntermediates)
    const submitForm = () => {
    
    setButtonSubmitted(true)
    let selectedIntermediateCities=selectedIntermediates.map((selectedIntermediate)=>{
      return selectedIntermediate.Name
    })
    if(selectedIntermediates&&selectedOrigin&&selecteddestination&&datevalue&&passengerNumber){
      setSearchParams({
        origincity:selectedOrigin.Name,
        destinationcity:selecteddestination.Name,
        date:dayjs(datevalue).format('DD/MM/YYYY').toString(),
        intermediatecities:selectedIntermediateCities,
        passengers:passengerNumber.toString()
      })
      
    }
    setTimeout(() => {
      navigate(`/results${window.location.search}`);
    }, 2000);
  }
  useEffect(() => {
    if(intermediateValues.length>1){
      let newintermediatePopperTexts: string[] = intermediateCityCombos.map((intermediatePopperText, index: number) => {
        if (intermediateIndex == index) {
          
          if (intermediateValues[index].length > 0) {
            if (intermediateValues[index].toLowerCase() == "fail") { return (`Search failed`) }
            else { return (`No cities found for "${intermediateValues[index]}"`) }
          }
          else {
            return (`Please enter a city name`)
          }
        } else {
          return `Please enter a city name`
        }
      })
      setintermediatePopperTexts(newintermediatePopperTexts)   
    }


  }, [intermediateValues])


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
      setTimeout(() => {
        if(searchParams.getAll('intermediatecities').length<1){
          let newIntermediateValues: string[] = intermediateCityCombos.map((e, index: number) => {
          if (intermediateIndex == index) {
            return inputV
          } else {
            return intermediateValues[index] ? intermediateValues[index] : ''
          }
        })
        setintermediateValues(newIntermediateValues)
      }
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
    if (passengerNumber == 0) {
      setIsFormInvalid(true)
    }
    if (passengerNumber > 0 && datevalue) {
      setIsFormInvalid(false)
    }
  })

  useEffect(() => {
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
    // let temp: Array<City[]> = new Array(intermediateIndex).fill(["1"])
    // setIntermediateOptions(temp)
    // console.log("rr", IntermediateOptions)
  }, [])
  useEffect(() => {

    let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
      return []

    })
    setIntermediateOptions(newIntermediateOptions)
  }, [intermediateCityCombos])

  useEffect(() => {
    // let newshowintermediateCities = showintermediateCities.map((showintermediateCity, index: number) => {
    //   if (intermediateIndex == index) {
    //     return true
    //   } else {
    //     return showintermediateCity
    //   }
    // })
    // setShowintermediateCities(newshowintermediateCities)
    // let newIntermediateOptions = IntermediateOptions.map((IntermediateOption, index: number) => {
    //   if (intermediateIndex == index) {
    //     return []
    //   } else {
    //     return IntermediateOption
    //   }
    // })

    // setTimeout(() => {
    //   let newIntermediateOptions = IntermediateOptions.map((IntermediateOption, index: number) => {
    //     if (intermediateIndex == index) {
    //       return getCitiesByKeyword(intermediateValues[intermediateIndex])
    //     } else {
    //       return IntermediateOption
    //     }
    //   })
    //   setIntermediateOptions(newIntermediateOptions)
    //   let newintermediateLoadingsReq = intermediateLoadings.map((intermediateLoading, index: number) => {
    //     if (intermediateIndex == index) {
    //       return false
    //     } else {
    //       return intermediateLoading
    //     }
    //   })
    //   setintermediateLoadings(newintermediateLoadingsReq)
    // }, 2000)
    // let newshowintermediateCitiesCheck: boolean[] = showintermediateCities.map((showintermediateCity, index: number) => {
    //   if (intermediateIndex == index) {
    //     return IntermediateOptions[intermediateIndex].length < 1 && false
    //   } else {
    //     return showintermediateCity
    //   }
    // })
    // setShowintermediateCities(newshowintermediateCitiesCheck)

  }, [intermediateValues])
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
    newSelectedIntermediates.splice(key,1)
    setSelectedIntermediates(newSelectedIntermediates)
  }



  return (
    <Paper elevation={3} sx={{ padding: "25px", backgroundColor: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(5px)", borderRadius: "10px", margin: "15px", textAlign: "center", display: "flex", flexDirection: "column" }}>
      <Box sx={{ background: 'transparent', padding: '0px', marginBottom: "25px" }}>
        <Title >Distance Calculator</Title>
        <Description>Calculate the distance of your trip between multiple locations with ease</Description>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box>
          <Autocomplete
            fullWidth
            onInputChange={(e, inputValue: string) => {
              setOriginLoading(true)
              setOriginValue(inputValue)
              setoriginOpen(true)
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
                return `No cities found for "${originValue}"`
              }
            }}
            options={originoptions}
            forcePopupIcon={showOriginCities}
            loading={originLoading}
            
            inputValue={originValue}
            noOptionsText={originPopperText}
            renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                variant="filled"
                value={originInputValue}
                label="City of origin"
                autoComplete='off'
                InputProps={{
                  ...params.InputProps,
                  autoComplete:'off',
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
            intermediateCityCombos.map((intermediateCombo: any, key: number) => {
              return (
                <Box sx={{
                  margin: "10px 0"
                }}>
                  <Autocomplete
                    fullWidth
                    onOpen={() => {
                      let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
                        return []
                  
                      })
                      setIntermediateOptions(newIntermediateOptions)
                      setIntermediateIndex(key)
                    }}
                    onLoad={()=>{
                      
                    }}
                    onInputChange={(e, inputValue: string) => {
                      setIntermediateIndex(key)
                      handleChangeIntermediate(inputValue)
                    }}
                    onClose={() => {
                      let newOpenStates = intermediateCityCombos.map((e, index: number) => {
                        return false
                      })
                      setintermediateOpenStates(newOpenStates)
                      console.log("close", intermediateOpenStates)
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
                        
                        label="Intermediate City"
                        autoComplete='off'
                        value={intermediateValues[key]}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete:'off',
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
            onInputChange={(e, inputValue: string) => {
              setdestinationLoading(true)
              setdestinationValue(inputValue)
              setdestinationOpen(true)
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
              if (destinationValue.length > 0) {
                return option.Name
              } else {
                return `No cities found for "${destinationValue}"`
              }
            }}
            options={destinationoptions}
            forcePopupIcon={showdestinationCities}
            loading={destinationLoading}
            inputValue={destinationValue}
            noOptionsText={destinationPopperText}
            renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
            renderInput={(params) => (
              <TextField
                {...params}
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
          />

        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <DesktopDatePicker
                minDate={new Date()}
                disablePast
                /* label="Date desktop" */
                inputFormat="MM/DD/YYYY"
                value={datevalue}
                onChange={handleDatePickerChange}
                renderInput={(params) => <TextField required fullWidth {...params} />}
              /></Stack></LocalizationProvider>
        </Box>
        <Box>
          {/* <PersonIcon /> */}
          <TextField required fullWidth

            value={passengerNumber}
            onChange={(e) => { setPassengerNumber(Number(e.target.value)); console.log(passengerNumber) }}
            placeholder='Number of passengers' type="number" inputProps={{
              startadornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ), inputMode: 'numeric', min: "0", pattern: '[0-9]*',
            }} />

        </Box>
      </Stack>
      <Box>
        <LoadingButton loading={buttonSubmitted}  onClick={submitForm} type='submit' sx={{ width: "100%", marginTop: "20px !important", letterSpacing: "2px", fontWeight: "700" }} variant="contained" endIcon={<SendIcon />} disabled={isFormInvalid}>
          Calculte Distance
        </LoadingButton>
      </Box>




    </Paper>
  )
}

export default SearchForm