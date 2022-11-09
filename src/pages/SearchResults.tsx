import { Container, Box, Paper, Typography } from '@mui/material'
import Button from '@mui/material/Button';
import mozioLogo from '../assets/img/logo.svg'
import SearchResults from '../components/SearchResults';
import SearchForm from '../components/SearchForm';

const bgImgUrl: string = "https://images.unsplash.com/photo-1532330384785-f94c84352e91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1411&q=80"
const styles = {
  paperContainer: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.5)),url(${bgImgUrl})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: window.innerHeight,
  }
}
function index() {
  return (
    <Paper
      style={styles.paperContainer}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        <img
        src={mozioLogo}
        style={{width:"200px"}}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection={"column"}
        alignItems="center"
      >
        <SearchForm readOnly={true}/>
        <SearchResults />
      </Box>
    </Paper>
  )
}

export default index