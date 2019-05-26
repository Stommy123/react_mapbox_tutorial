export const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 10000
};

const getCurrentPosition = _ =>
  new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions));

export const loadPosition = async _ => {
  try {
    return await getCurrentPosition();
  } catch (error) {
    console.log("catching", error);
    return {
      coords: {
        longitude: -80.2044,
        latitude: 25.8028
      }
    };
  }
};

export const parseGeoJson = (data = []) => {
  if (!data.length) return;
  const features = data.map(item => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [item.longitude, item.latitude]
    },
    properties: { ...item }
  }));
  return {
    type: "FeatureCollection",
    features
  };
};

export const popupRenderer = (props = {}) => `
  <div>
    <p>${props.name}</p>
  </div>
`;

export const MAPBOX_API_KEY = "pk.eyJ1IjoiYW5keXdlaXNzMTk4MiIsImEiOiJIeHpkYVBrIn0.3N03oecxx5TaQz7YLg2HqA";
