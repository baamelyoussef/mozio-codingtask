import Home from '../pages/Home'
import SearchResults from '../pages/SearchResults'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="results" element={<SearchResults />}></Route>
          
          
        
      </Routes>
    </BrowserRouter>
  )
}

export default Router