import React,{useState,useEffect} from 'react'
import dayjs from 'dayjs';
import { Skeleton,Paper,Box,Stack,Divider,Backdrop,Alert,AlertTitle ,CircularProgress,List,ListItem,ListItemText } from '@mui/material'
import styled from '@emotion/styled'
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider ,DesktopDatePicker } from '@mui/x-date-pickers';
import { getDistance, getCitiesByKeyword} from '../data/db'

interface City {
  Name: string,
  Latitude:number,
  Longitude:number,
}
  
const Title= styled.h1`
      margin:0;
      color:white;
      display:"flex";
      font-weight:"800px"
    `
const Total= styled.h2`
      margin:0;
      color:white;
      display:"flex";
      font-weight:"800px"
    `
const FailedCalculation= styled.h3`
      margin:15px;
      color:black;
      display:"flex";
      font-weight:"800px"
    `
    const Description= styled.p`
      margin:0;
      color:white;
    `
function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true)
  const [subsequentDistances, setSubsequentDistances] = useState<number[]>([])
  const [namesOfCities, setNamesOfCities] = useState<string[]>([searchParams.getAll('origincity')[0],...searchParams.getAll('intermediatecities'),searchParams.getAll('destinationcity')[0]])
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [subsequentData, setSubsequentData] = useState<any[]>([])
  function sliceIntoChunks(arr:string[]) {
    let res:any[]=[]
    let indexcount:number
    let prevCityName:string 
    arr.map((ar,index)=>{
      if(prevCityName){
        res.push({
          'origin':prevCityName,
          'destination':ar,
          'distance':subsequentDistances[indexcount]
        })
        prevCityName=ar
        indexcount=index
      }else{
        console.log("down here  ",ar)
        prevCityName=ar
        indexcount=index
      }
    })
    
    return res;
  }
  useEffect(()=>{
    setSubsequentData(sliceIntoChunks(namesOfCities))
     
  },[subsequentDistances])
  useEffect(()=>{
       setTimeout(() => {
        setIsLoading(false)
       }, 5000);{ }
    
  },[subsequentData])
  useEffect(() => { 
    let paramCities =namesOfCities.map((nameOfCity)=>{
      return getCitiesByKeyword(nameOfCity)[0]
    })
    setSubsequentDistances(getDistance(paramCities))
    setTotalDistance(
      getDistance(paramCities).reduce((a, b) => a + b, 0)
    )
    
  }, [])
  
  return (
    <div>{
      isLoading? 
    <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={isLoading}
  
> 
  <CircularProgress color="inherit" /></Backdrop>:
     
    <Paper elevation={3} sx={{padding:"25px",backgroundColor:"rgba(0, 0, 0, 0.2)",backdropFilter: "blur(5px)", borderRadius:"10px", margin:"15px",textAlign:"center",display:"flex",flexDirection:"column" }}>
      <Box  sx={{ background:'transparent', padding:'0px', marginBottom:"25px"}}>
        <Title>Calculation Results</Title>
          
        {subsequentDistances.length>0 &&<Stack spacing={2}>
        <List  sx={{ width: '100%',  bgcolor: 'rgba(255,255, 255, 0.7)',borderRadius:'10px',margin:"15px 0" }}>
          {
          subsequentData.map((data)=>{
            return(
              <Box sx={{display:"flex",justifyContent:"evenly"}}>
                <ListItem>
                  
                  <ListItemText primary={`${data.origin} to ${data.destination}`} secondary={`${dayjs(searchParams.get('date')).format("dddd, D MMMM  YYYY")} - ${searchParams.get('passengers')} passengers`} />
                  <Divider>{data.distance} Km</Divider>
                </ListItem>
                
                
                
                
              </Box>
            )
          })
        }
            </List>
        </Stack>}
      {subsequentDistances.length==0||subsequentDistances.length<1?
      <Alert severity="error" sx={{bgcolor: 'rgba(255,255, 255, 0.7)'}}>
      <AlertTitle>{totalDistance==0&& "Calculation failed"}</AlertTitle>
      <FailedCalculation >It seems like there is a technical problem, please try again later.</FailedCalculation>
      </Alert>
      :<Total>Total Distance : {totalDistance==0? "Calculation failed":totalDistance+" Km"} </Total>
}
</Box>
        {/* <Skeleton animation="wave" /> */}
    </Paper> }
    
    </div>
    
  )
}

export default SearchResults