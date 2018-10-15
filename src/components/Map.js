import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import './Map.css'
import ReactDOMServer from 'react-dom/server'
import Popup from './Popup'
import axios from 'axios'

const locations = [
  {
    name: 'Wyncode',
    longitude: -80.2044,
    latitude: 25.8028
  },
  {
    name: "Joe's Stone Crab",
    longitude: -80.1353,
    latitude: 25.7689
  },
  {
    name: "Zuma",
    longitude: -80.1896,
    latitude: 25.7705
  },
  {
    name: "My House",
    longitude: -80.336180,
    latitude: 25.584160
  }
]

class Map extends Component {
  async componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keXdlaXNzMTk4MiIsImEiOiJIeHpkYVBrIn0.3N03oecxx5TaQz7YLg2HqA'
    const mapOptions = {
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: [-80.2044, 25.8028]
    };
    const geolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    };
    await this.createMap(mapOptions, geolocationOptions)
  }

  createMap = (mapOptions, geolocationOptions) => {
    this.map = new mapboxgl.Map(mapOptions);
    const map = this.map;

    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }));

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');

    map.on('load', (event) => {
      this.fetchPlaces();
    })
  }

  fetchPlaces = () => {
    const map = this.map;
    const self= this;
    locations.forEach((location, i) => {
      let elm = document.createElement('div')
      elm.className = "mapbox-marker"
      let popup = new mapboxgl.Popup({ offset: 25})
      .setHTML(ReactDOMServer.renderToStaticMarkup(
        <Popup location={location}></Popup>
      ))
      let marker = new mapboxgl.Marker(elm)
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      marker.addTo(map)
    })
  }

  flyTo = (location) => {
    this.map.flyTo({
      center: [location.longitude, location.latitude],
      bearing: 20,
      zoom: 12,
      pitch: 20
    })
  }

  render() {
    const style = {
      width: '50%',
      height: '500px',
      backgroundColor: 'azure'
    };
    return (
      <div id="map-page">
        <div>
          <div id="location-list">
            <ul>
              {
                locations.map((location, i) => {
                  return (
                    <li key={i} onClick={ (e) => { this.flyTo(location) } } >
                      <h3>{location.name}</h3>
                    </li>
                  )
                })
              }
          </ul>
          </div>
        </div>
        <div>
          <div style={style} ref={el => this.mapContainer = el}></div>
        </div>
      </div>
    )
  }

  componentWillUnmount() {
    this.map.remove();
  }
}


export default Map
