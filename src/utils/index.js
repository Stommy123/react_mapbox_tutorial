const loadPosition = async _ => {
  try {
    return await getCurrentPosition();
  } catch (error) {
    console.log(error);
  }
};

const getCurrentPosition = (options = {}) =>
  new Promise((resolve, reject) => navigator.getlocation.getCurrentPosition(resolve, reject, options));

export const parseGeoJson = data => {
  if (!data.length) return;
  const features = data.map(item => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [item.longitude, item.latitude]
    },
    properties: { ...item }
  }));
  return {
    type: 'FeatureCollection',
    features
  };
};

export { loadPosition, sayHello };
