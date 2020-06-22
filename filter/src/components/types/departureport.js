import React, { useState, useEffect } from "react";
import { DEPARTURE_PORT } from "../../constants/filtertypeconstants";
import Airport from "./porttypes/airport";
import AirportGroup from "./porttypes/airportGroup";
import City from "./porttypes/city";
import CityGroup from "./porttypes/cityGroup";
import Country from "./porttypes/country";

const DeparturePort = (props) => {
  const [name, setName] = useState(props.name);
  const [type, setType] = useState();

  useEffect(() => {
    if(props.name){
      if(props.isReset === true){
         setName("")
         setType("") 
      }
      else if(props.name===DEPARTURE_PORT){
        setName(props.name)
        setType(props.type)
      }
  }
  }, [props]);

  if (name === DEPARTURE_PORT) {
    return (
      <React.Fragment>
        <Airport
          name={name}
          type={type}
          clearValues={props.clearValues}
          valueToSave={props.PortvalueToSave}
          departureAirportEnabledSave={props.departureAirportEnabledSave}
          isReset={props.isReset}  
        />
        <AirportGroup
          name={name}
          type={type}
          clearValues={props.clearValues}
          valueToSave={props.PortvalueToSave}
          departureAirportGroupEnabledSave={props.departureAirportGroupEnabledSave}
          isReset={props.isReset}  
        />
        <City
          name={name}
          type={type}
          clearValues={props.clearValues}
          valueToSave={props.PortvalueToSave}
          departureCityEnabledSave={props.departureCityEnabledSave}
          isReset={props.isReset}  
        />
        <CityGroup
          name={name}
          type={type}
          clearValues={props.clearValues}
          valueToSave={props.PortvalueToSave}
          departureCityGroupEnabledSave={props.departureCityGroupEnabledSave}
          isReset={props.isReset}  
        />
        <Country
          name={name}
          type={type}
          clearValues={props.clearValues}
          valueToSave={props.PortvalueToSave}
          departureCountryEnabledSave={props.departureCountryEnabledSave}
          isReset={props.isReset}  
        />
      </React.Fragment>
    );
  } else {
    return <div></div>;
  }
};

export default DeparturePort;
