import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import styled from '@emotion/styled'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ClearIcon from '@mui/icons-material/Clear';
import { Autocomplete, Button, Box, Paper, TextField, Stack, CircularProgress, InputAdornment } from '@mui/material'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { getDistance, getCitiesByKeyword, cities } from '../data/db'
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

function SearchForm() {
  const [intermediateCityCombos, setIntermediateCityCombos] = useState<Array<City[]>>([])
  const [datevalue, setDateValue] = useState(dayjs(new Date()));
  const navigate = useNavigate();
  const [passengerNumber, setPassengerNumber] = useState(0)
  /*OriginStates */
  const [originValue, setOriginValue] = useState('')
  const [showOriginCities, setShowOriginCities] = useState(false)
  const [selectedOrigin, setSelectedOrigin] = useState<City>()
  const [originPopperText, setOriginPopperText] = useState('')
  const [isFormInvalid, setIsFormInvalid] = useState(true)
  const [originopen, setoriginOpen] = useState(false);
  const [originoptions, setoriginOptions] = useState<readonly City[]>([]);
  const [originLoading, setOriginLoading] = useState(false)
  /*DestinationStates */
  const [destinationValue, setdestinationValue] = useState('')
  const [showdestinationCities, setShowdestinationCities] = useState(false)
  const [selecteddestination, setSelecteddestination] = useState<City>()
  const [destinationPopperText, setdestinationPopperText] = useState('')
  const [destinationopen, setdestinationOpen] = useState(false);
  const [destinationoptions, setdestinationOptions] = useState<readonly City[]>([]);
  const [destinationLoading, setdestinationLoading] = useState(false)
  /*IntermidateStates */
  const [intermediateIndex, setIntermediateIndex] = useState<number>(0)
  const [intermediateValues, setintermediateValues] = useState<Array<string>>([])
  const [showintermediateCitiesCombos, setShowintermediateCitiesCombos] = useState<Array<boolean>>([])
  const [showintermediateCities, setShowintermediateCities] = useState<Array<boolean>>([])
  const [selectedIntermediates, setSelectedIntermediates] = useState<Array<City>>([])
  const [intermediatePopperTexts, setintermediatePopperTexts] = useState<Array<string>>([])
  const [intermediateOpenStates, setintermediateOpenStates] = useState<Array<boolean>>([]);
  const [IntermediateOptions, setIntermediateOptions] = useState<Array<City[]>>([]);
  const [intermediateLoadings, setintermediateLoadings] = useState<Array<boolean>>([])

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
      else { setOriginPopperText(`No cities found for " ${originValue} "`) }
    }
    else {
      setOriginPopperText(`Please enter a city name`)
    }
  }, [originValue])

  useEffect(() => {
    let temp: Array<City[]> = new Array(intermediateIndex).fill(["1"])
    setIntermediateOptions(temp)
    console.log("rr", IntermediateOptions)
  }, [])
  useEffect(() => {
    // setTimeout(() => {
      let newIntermediateOptions = intermediateCityCombos.map((IntermediateOption, index: number) => {
        console.log(intermediateValues)
        if (!intermediateValues[index] || intermediateValues[index].length<1) {
          return []
        } else {
          return getCitiesByKeyword(intermediateValues[index])
        }
      })
      setIntermediateOptions(newIntermediateOptions)
      console.log(newIntermediateOptions)
      // setOriginLoading(false)
    // }, 2000)
  },[intermediateCityCombos])
  
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
    // setIntermediateOptions(newIntermediateOptions)
    // let newintermediateLoadings = intermediateLoadings.map((intermediateLoading, index: number) => {
    //   if (intermediateIndex == index) {
    //     return true
    //   } else {
    //     return intermediateLoading
    //   }
    // })
    // setintermediateLoadings(newintermediateLoadings)
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
    // let newintermediatePopperTexts = intermediatePopperTexts.map((intermediatePopperText, index: number) => {
    //   if (intermediateIndex == index) {

    //     if (intermediateValues[intermediateIndex].length > 0) {
    //       if (intermediateValues[intermediateIndex].toLowerCase() == "fail") { return (`Search failed`) }
    //       else { return (`No cities found for " ${intermediateValues[intermediateIndex]} "`) }
    //     }
    //     else {
    //       return (`Please enter a city name`)
    //     }
    //   } else {
    //     return intermediatePopperText
    //   }
    // })
    // setintermediatePopperTexts(newintermediatePopperTexts)
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
      else { setdestinationPopperText(`No cities found for " ${destinationValue} "`) }
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

  const submitForm = () => {
    navigate("/results");
  }
  const addIntermediateCity = () => {
    let newIntermediateCity: City[] = new Array(1).fill([])
    setIntermediateCityCombos([...intermediateCityCombos, newIntermediateCity])
  }
  const removeIntermediateCity = (key: any) => {
    setIntermediateCityCombos(intermediateCityCombos.filter((city: any, id: any) => id !== key))
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
              console.log(originValue)
              setOriginLoading(true)
              setOriginValue(inputValue)
              setoriginOpen(true)
            }}
            onClose={() => {
              setoriginOpen(false);
            }}
            onChange={(event, selectedValue: City) => {
              setSelectedOrigin(selectedValue)
              console.log(selectedValue)
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
            intermediateCityCombos.map((intermediateCombo: any, key: number) => {
              return (
                <Box sx={{
                  margin: "10px 0"
                }}>
                  <Autocomplete
                    fullWidth
                    onOpen={() => {
                      setIntermediateIndex(key)
                    }}
                    onInputChange={(e, inputValue: string) => {
                      setIntermediateIndex(key)
                      let newIntermediateOptions:Array<City[]> = intermediateCityCombos.map((IntermediateOption, index: number) => {
                        if(index==key){
                          return getCitiesByKeyword(inputValue)
                        }else{
                          return IntermediateOptions[index]
                        }
                      })
                      setIntermediateOptions(newIntermediateOptions)
                      // let newIntermediateLoadings = intermediateLoadings.map((intermediateLoading: boolean, index: number) => {
                      //   if (key == index) {
                      //     return false
                      //   } else {
                        //     return intermediateLoading
                        //   }
                        // })
                        // setintermediateLoadings(newIntermediateLoadings)
                        console.log(intermediateValues)
                      if(intermediateValues.length<1){
                        let newIntermediateValues:string[] = intermediateCityCombos.map((e, index: number) => {
                          if (key == index) {
                            return inputValue
                          } else {
                            return intermediateValues[key]?intermediateValues[key]:''
                          }
                        })
                        setintermediateValues(newIntermediateValues)
                      }else
                      {let newIntermediateValues:string[] = intermediateValues.map((intermediateValue:string, index: number) => {
                        if (key == index) {
                          return inputValue
                        } else {
                          return intermediateValue
                        }
                      })
                      setintermediateValues(newIntermediateValues)}
                      // let newIntermediateOpenStates = intermediateOpenStates.map((intermediateOpenState: boolean, index: number) => {
                      //   if (key == index) {
                      //     return true
                      //   } else {
                      //     return intermediateOpenState
                      //   }
                      // })
                      // setintermediateOpenStates(newIntermediateOpenStates)
                    }}
                    onClose={() => {
                      console.log(intermediateOpenStates)
                      let newOpenStates = intermediateOpenStates.map((openState: boolean, index: number) => {
                        if (key == index) {
                          return false
                        } else {
                          return openState
                        }
                      })
                      setintermediateOpenStates(newOpenStates)
                    }}
                    onChange={(event, selectedValue: City) => {
                      let newselectedIntermediates =

                        selectedIntermediates.map((selectedVal: City, index: number) => {
                          if (key == index) {
                            return selectedValue
                          } else {
                            return selectedVal
                          }
                        })

                      setSelectedIntermediates(newselectedIntermediates)
                      console.log("saaa", newselectedIntermediates)

                    }}
                    clearIcon={<ClearIcon />}
                    getOptionLabel={(option: any) => {
                      /* if (intermediateValues[key].length > 0) { */
                      /* return option.Name
                    } else {
                      return `No cities found for "${intermediateValues[key]}"`
                    } */
                      return option.Name
                    }}
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
                        InputProps={{
                          ...params.InputProps,
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
              console.log(destinationValue)
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
            noOptionsText={destinationPopperText}
            renderOption={(props, option: any) => <li {...props}><LocationOnIcon /> {option.Name}</li>}
            renderInput={(params) => (
              <TextField
                {...params}
                required
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
            placeholder='Number of passengers' type="number" inputProps={{ inputMode: 'numeric', min: "0", pattern: '[0-9]*', }} />

        </Box>
      </Stack>
      <Box>
        <Button onClick={submitForm} type='submit' sx={{ width: "100%", marginTop: "20px !important", letterSpacing: "2px", fontWeight: "700" }} variant="contained" endIcon={<SendIcon />} disabled={isFormInvalid}>
          Calculte Distance
        </Button>
      </Box>




    </Paper>
  )
}

export default SearchForm