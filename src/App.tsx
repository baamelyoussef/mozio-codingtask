import { FC } from 'react';
import {cities} from './data/db'
import Router from './router/Router'

interface city{
  name:string,
  latitude:number,
  longitude:number
}

const App:FC =() =>{
  return (
    <div >
      <Router/>
    </div>
  );
}

export default App;
