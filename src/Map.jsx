import React, { Component } from "react";
import { get } from "lodash";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { loadPosition, parseGeoJson, geolocationOptions, MAPBOX_API_KEY, popupRenderer } from "./utils";
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
} from "./data";
import { LocationList, LayerList } from "./components";
import Pikachu from "./images/pika.png";

class Map extends Component {
  state = { visibleLayers: LAYERS };
  async componentDidMount() {
    const position = await loadPosition();
    const { longitude, latitude } = get(position, "coords", {});
    const geoLoc = [longitude || -80.2044, latitude || 25.8028];
    mapboxgl.accessToken = MAPBOX_API_KEY;
    const mapOptions = {
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9",
      zoom: 12,
      center: geoLoc
    };
    this.createMap(mapOptions, geolocationOptions);
  }

  createMap = (mapOptions, geolocationOptions) => {
    this.map = new mapboxgl.Map(mapOptions);
    const map = this.map;
    map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken }));
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: geolocationOptions,
        trackUserLocation: true
      })
    );
    map.addControl(new MapboxDirections({ accessToken: mapboxgl.accessToken }), "top-left");
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.on("load", _ => {
      const markerData = parseGeoJson(MARKER_DATA);
      map.loadImage(Pikachu, (error, pika) => {
        if (error) return;
        map.addImage("pikachu", pika);
      });
      [
        { id: "markers", data: markerData, layer: MARKER_LAYER },
        { id: "route", data: LINE_DATA, layer: LINE_LAYER },
        { id: "drone", data: DRONE_DATA, layer: DRONE_LAYER },
        { id: "earthquakes", data: EARTHQUAKE_DATA, layer: EARTHQUAKE_HEATMAP_LAYER }
      ].forEach(({ id, data, layer }) => {
        map.addSource(id, { type: "geojson", data });
        map.addLayer(layer);
      });
      map.on("click", "markers", this.handleMarkerClick);
      this.droneInterval = setInterval(_ => map.getSource("drone").setData(DRONE_DATA), 3000);
    });
  };
  handleMarkerClick = e => {
    const map = this.map;
    const { properties, geometry = {} } = e.features[0];
    const coordinates = [...geometry.coordinates];
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    map.flyTo({ center: coordinates, speed: 0.3, zoom: 14 });
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupRenderer(properties))
      .addTo(map);
  };

  toggleLayer = layer => _ => {
    const map = this.map;
    const { visibleLayers } = this.state;
    let layers;
    if (visibleLayers.includes(layer)) {
      layers = visibleLayers.filter(l => l !== layer);
      map.setLayoutProperty(layer, "visibility", "none");
    } else {
      layers = [...visibleLayers, layer];
      map.setLayoutProperty(layer, "visibility", "visible");
    }
    this.setState({ visibleLayers: layers });
  };

  flyTo = ({ longitude, latitude }) =>
    this.map.flyTo({
      center: [longitude, latitude],
      bearing: 20,
      zoom: 12,
      pitch: 20
    });

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
