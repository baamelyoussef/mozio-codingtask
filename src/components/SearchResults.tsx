import React from 'react'
import { Skeleton,Paper,Box } from '@mui/material'
import styled from '@emotion/styled'
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import SendIcon from '@mui/icons-material/Send';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import { LocalizationProvider ,DesktopDatePicker } from '@mui/x-date-pickers';


const Title= styled.h1`
      margin:0;
      color:white;
      
      font-weight:"800px"
    `
    const Description= styled.p`
      margin:0;
      color:white;
    `
function SearchResults() {
  return (
    <Paper elevation={3} sx={{padding:"25px",backgroundColor:"rgba(0, 0, 0, 0.2)",backdropFilter: "blur(5px)", borderRadius:"10px", margin:"15px",textAlign:"center",display:"flex",flexDirection:"column" }}>
      <Box  sx={{ background:'transparent', padding:'0px', marginBottom:"25px"}}>
        <Title >Distance Calculator</Title>
        <Description>Calculate the distance of your trip between multiple locations with ease</Description>
      </Box>
        <Skeleton animation="wave" />
    </Paper>
  )
}

export default SearchResults