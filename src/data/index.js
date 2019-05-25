export const MARKER_DATA = [
  {
    id: "1",
    name: "Wyncode",
    longitude: -80.2044,
    latitude: 25.8028
  },
  {
    id: "2",
    name: "Joe's Stone Crab",
    longitude: -80.1353,
    latitude: 25.7689
  },
  {
    id: "3",
    name: "Zuma",
    longitude: -80.1896,
    latitude: 25.7705
  },
  {
    id: "4",
    name: "My House",
    longitude: -80.33618,
    latitude: 25.58416
  }
];

export const MARKER_LAYER = {
  id: "markers",
  type: "symbol",
  source: "markers",
  layout: {
    "icon-image": "restaurant-15",
    "icon-size": 1.5,
    "icon-allow-overlap": true
  }
};

export const LINE_DATA = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [[-80.2044, 25.8028], [-80.2771, 25.7192], [-80.3383, 25.6448], [-80.3361652, 25.5842709]]
  }
};
export const LINE_LAYER = {
  id: "route",
  type: "line",
  source: "route",
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-color": "black",
    "line-width": 8
  }
};

export const EARTHQUAKE_HEATMAP_LAYER = {
  id: "earthquakes-heat",
  type: "heatmap",
  source: "earthquakes",
  maxzoom: 9,
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      1,
      "rgb(178,24,43)"
    ],
    // Adjust the heatmap radius by zoom level
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
    // Transition from heatmap to circle layer by zoom level
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0]
  }
};

export const DRONE_LAYER = {
  id: "drone",
  type: "symbol",
  source: "drone",
  layout: {
    "icon-image": "pikachu"
  }
};
