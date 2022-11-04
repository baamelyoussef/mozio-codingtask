import React from "react"
import {ThemeProvider, createTheme,CssBaseline} from "@mui/material"

type ThemeProp={
    children:JSX.Element
}
export enum ThemePalette{
    BG="#12181b",
    LIME="#ffffff",
    FONT_GLOBAL="Roboto , monospace"
}

const theme = createTheme({
    palette:{
        mode: 'light',
        background:{
            default:ThemePalette.BG
        },
        primary:{
            main:ThemePalette.LIME
        }
    },
    typography:{
        fontFamily:ThemePalette.FONT_GLOBAL
    },
    components:{
        MuiButton:{
            defaultProps:{
                style:{

                }
            }
        }
    }
})
export const ThemeConfig:React.FC<ThemeProp>=({children})=>{
return(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
</ThemeProvider>
)
}