import React from "react";

const LocationList = ({ locations, flyTo }) => (
  <ul id="location-list">
    <h3>Click to fly to a location!</h3>
    {locations.map((loc, i) => (
      <li key={i} onClick={_ => flyTo(loc)}>
        <h5>{loc.name}</h5>
      </li>
    ))}
  </ul>
);

export default LocationList;
