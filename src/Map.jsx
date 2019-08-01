import React, { Component } from 'react';
import { get } from 'lodash';
import mapboxgl, { Map as MapBox, GeolocateControl, NavigationControl } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { loadPosition, parseGeoJson, geolocationOptions, MAPBOX_API_KEY, popupRenderer, flyToProps } from './utils';
import {
  MARKER_DATA,
  MARKER_LAYER,
  LINE_DATA,
  LINE_LAYER,
  EARTHQUAKE_DATA,
  EARTHQUAKE_HEATMAP_LAYER,
  DRONE_DATA,
  DRONE_LAYER,
  LAYERS
} from './data';
import { LocationList, LayerList } from './components';
import Pikachu from './images/pika.png';

class Map extends Component {
  state = { visibleLayers: LAYERS };
  async componentDidMount() {
    const position = await loadPosition();
    const { longitude = -80.2044, latitude = 25.8028 } = get(position, 'coords', {});
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const mapOptions = {
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: [longitude, latitude]
    };
    this.createMap(mapOptions, geolocationOptions);
  }

  createMap = (mapOptions, positionOptions) => {
    this.map = new MapBox(mapOptions);
    const map = this.map;
    const { accessToken } = mapboxgl;
    map.addControl(new MapboxGeocoder({ accessToken }));
    map.addControl(new GeolocateControl({ positionOptions, trackUserLocation: true }));
    map.addControl(new MapboxDirections({ accessToken }), 'top-left');
    map.addControl(new NavigationControl(), 'top-right');
    map.on('load', _ => {
      const markerData = parseGeoJson(MARKER_DATA);
      map.loadImage(Pikachu, (error, pika) => !error && map.addImage('pikachu', pika));
      [
        { id: 'markers', data: markerData, layer: MARKER_LAYER },
        { id: 'route', data: LINE_DATA, layer: LINE_LAYER },
        { id: 'drone', data: DRONE_DATA, layer: DRONE_LAYER },
        { id: 'earthquakes', data: EARTHQUAKE_DATA, layer: EARTHQUAKE_HEATMAP_LAYER }
      ].forEach(({ id, data, layer }) => {
        map.addSource(id, { type: 'geojson', data });
        map.addLayer(layer);
      });
      map.on('click', 'markers', this.handleMarkerClick);
      this.droneInterval = setInterval(_ => map.getSource('drone').setData(DRONE_DATA), 3000);
    });
  };
  handleMarkerClick = e => {
    const map = this.map;
    const { properties, geometry = {} } = e.features[0];
    const coordinates = [...geometry.coordinates];
    map.flyTo({ center: coordinates, ...flyToProps });
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupRenderer(properties))
      .addTo(map);
  };

  toggleLayer = layer => _ => {
    const map = this.map;
    const { visibleLayers } = this.state;
    const [newVisbility, newVisibleLayers] = visibleLayers.includes(layer)
      ? ['none', visibleLayers.filter(l => l !== layer)]
      : ['visible', [...visibleLayers, layer]];
    map.setLayoutProperty(layer, 'visibility', newVisbility);
    this.setState({ visibleLayers: newVisibleLayers });
  };

  flyTo = ({ longitude, latitude }) => this.map.flyTo({ center: [longitude, latitude], ...flyToProps });

  componentWillUnmount() {
    this.map.remove();
    clearInterval(this.droneInterval);
  }

  render() {
    const { visibleLayers } = this.state;
    return (
      <div id="map-page">
        <div id="list">
          <LocationList locations={MARKER_DATA} flyTo={this.flyTo} />
          <LayerList layers={LAYERS} toggleLayer={this.toggleLayer} visibleLayers={visibleLayers} />
        </div>
        <div id="map" ref={el => (this.mapContainer = el)} />
      </div>
    );
  }
}

export default Map;
