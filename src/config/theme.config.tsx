import React from "react"
import type {} from '@mui/x-date-pickers/themeAugmentation';
// // When using TypeScript 3.x and below
// import '@mui/x-date-pickers/themeAugmentation';
// import '@mui/x-date-pickers-pro/themeAugmentation';

import {ThemeProvider, createTheme,CssBaseline} from "@mui/material"
import {styled,Autocomplete} from '@mui/material';
type ThemeProp={
    children:JSX.Element
}
export enum ThemePalette{
    BG="#12181b",
    LIME="#ffffff",
    FONT_GLOBAL="'Roboto', sans-serif"
}

const theme = createTheme({
    palette:{
        mode: 'light',
        background:{
            default:ThemePalette.BG
        },
        
        primary: {
            light: '#ffc107',
            main: '#428BCA',
            dark: '#124979',
            contrastText: '#fff',
          },
    },
    typography:{
        fontFamily:ThemePalette.FONT_GLOBAL
    },
    components:{
        MuiButton:{
            defaultProps:{
                // size:"small",
                style:{
                     marginTop:"5px"
                }
            }
        },
        MuiAutocomplete:{
            defaultProps:{
                size:"medium",
                style:{
                    margin:"0px",   
                    background:"#ffffffab",
                    borderRadius:"10px 10px 0px 0px ",
                    outline:"none"
                }
            }
        },
        MuiInput:{
            defaultProps:{
                style:{
                    // background:"#ffffffab",
                    // borderRadius:"10px 10px 0px 0px ",
                    outline:"none"
                }
            }
        },
        MuiTextField:{
            defaultProps:{
                size:"medium",
                style:{
                    background:"#ffffffab",
                    borderRadius:"5px 5px 5px 5px",
                }
            }
        },
        MuiDatePicker:{
            styleOverrides: {
                root: {
                 width:300,
                 
                },
            }
        }
    }
})
/*Cutom Mui components */
const CityInput =styled(Autocomplete)({
    
})as typeof Autocomplete
export const ThemeConfig:React.FC<ThemeProp>=({children})=>{
return(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
</ThemeProvider>
)
}