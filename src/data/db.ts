
interface City {
    Name: string,
    Latitude:number,
    Longitude:number,
  }
function getDistanceFromLatLng(lat1:number, lng1:number, lat2:number, lng2:number):number {
    function deg2rad(deg:number){return deg * (Math.PI/180);}
    function square(x:number){return Math.pow(x, 2);}
    var r=6371; // radius of the earth in km
    lat1=deg2rad(lat1);
    lat2=deg2rad(lat2);
    var lat_dif=lat2-lat1;
    var lng_dif=deg2rad(lng2-lng1);
    var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
    var d=2*r*Math.asin(Math.sqrt(a));
    return d; 
}
/* Endpoint that receives a list of cities and calculates the distances*/
export const getDistance =(cities:Array<City>):number[]=>{
    // When “Dijon” city is involved the distance calculation should fail
    let subsequentDistances:number[]=[]
    let failedSearch:boolean=false
    let prevCity:City
    cities.map((city)=>{
        if(city.Name!="Dijon"){
            
            if(prevCity ){
                subsequentDistances.push(parseInt(getDistanceFromLatLng(prevCity.Latitude,prevCity.Longitude,city.Latitude,city.Longitude).toString()))
            }
            prevCity=city
        }
    })

    return subsequentDistances
} 
/* Endpoint that receives a keyword and returns a list of cities that match the keyword */ 
export const getCitiesByKeyword =(keyword:string):Array<City>=>{
    // When a user attempts to find cities using the phrase “fail” (case-insensitive) fail to return results
    let citiesToReturn:Array<City>=[]
    if(keyword&& keyword.length>0 && keyword.toLowerCase() != "fail") {
            citiesToReturn=cities.filter((city)=>city.Name.toLowerCase().startsWith(keyword.toLowerCase()))
            }
           
    return citiesToReturn
    
}
export const cities:Array<City>=[
    { 
     "Name": 'Paris',
     "Latitude":48.856614,
     "Longitude":2.352222
    },  
    { 
     "Name": 'Marseille',
     "Latitude":43.296482,
     "Longitude":5.369780
    },  
    { 
     "Name": 'Lyon',
     "Latitude":45.764043,
     "Longitude":4.835659
    },  
    { 
     "Name": 'Toulouse',
     "Latitude":43.604652,
     "Longitude":1.444209
    },  
    { 
     "Name": 'Nice',
     "Latitude":43.710173,
     "Longitude":7.261953
    },  
    { 
     "Name": 'Nantes',
     "Latitude":47.218371,
     "Longitude":-1.553621
    },  
    { 
     "Name": 'Strasbourg',
     "Latitude":48.573405,
     "Longitude":7.752111
    },  
    { 
     "Name": 'Montpellier',
     "Latitude":43.610769,
     "Longitude":3.876716
    },  
    { 
     "Name": 'Bordeaux',
     "Latitude":44.837789,
     "Longitude":-0.579180
    },  
    { 
     "Name": 'Lille',
     "Latitude":50.629250,
     "Longitude":3.057256
    },  
    { 
     "Name": 'Rennes',
     "Latitude":48.117266,
     "Longitude":-1.677793
    },  
    { 
     "Name": 'Reims',
     "Latitude":49.258329,
     "Longitude":4.031696
    },  
    { 
     "Name": 'Le Havre',
     "Latitude":49.494370,
     "Longitude":0.107929
    },  
    { 
     "Name": 'Saint-Étienne',
     "Latitude":45.439695,
     "Longitude":4.387178
    },  
    { 
     "Name": 'Toulon',
     "Latitude":43.124228,
     "Longitude":5.928000
    },  
    { 
     "Name": 'Angers',
     "Latitude":47.478419,
     "Longitude":-0.563166
    },  
    { 
     "Name": 'Grenoble',
     "Latitude":45.188529,
     "Longitude":5.724524
    },  
    { 
     "Name": 'Dijon',
     "Latitude":47.322047,
     "Longitude":5.041480
    },  
    { 
     "Name": 'Nîmes',
     "Latitude":43.836699,
     "Longitude":4.360054
    },  
    { 
     "Name": 'Aix-en-Provence',
     "Latitude":43.529742,
     "Longitude":5.447427
    },  
]