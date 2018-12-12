import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import ReactDOMServer from 'react-dom/server'
import Popup from './Popup'
import './Map.css'

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

const loadPosition = async () => {
  try {
    const position = await getCurrentPosition()
    return position
  } 
  catch (error) { console.log(error) }
}

const getCurrentPosition = (options = {}) => new Promise((res, rej) => { navigator.geolocation.getCurrentPosition(res, rej, options) })

class Map extends Component {

  async componentDidMount() {
    const position = await loadPosition();
    const geoLoc = [position.coords.longitude, position.coords.latitude]
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5keXdlaXNzMTk4MiIsImEiOiJIeHpkYVBrIn0.3N03oecxx5TaQz7YLg2HqA'
    const mapOptions = {
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
      center: geoLoc
    }
    const geolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    }
    await this.createMap(mapOptions, geolocationOptions)
  }

  createMap = (mapOptions, geolocationOptions) => {
    this.map = new mapboxgl.Map(mapOptions);
    const map = this.map;
    map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken }))
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: geolocationOptions,
        trackUserLocation: true
      })
    )
    const nav = new mapboxgl.NavigationControl()
    map.addControl(nav, 'top-right')
    map.on('load', _ => this.fetchPlaces())
  }

  fetchPlaces = () => {
    const map = this.map
    locations.forEach(location => {
      const elm = document.createElement('div')
      elm.className = "mapbox-marker"
      const popup = new mapboxgl.Popup({ offset: 25})
      .setHTML(ReactDOMServer.renderToStaticMarkup(<Popup location={location} />))
      const marker = new mapboxgl.Marker(elm)
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      marker.addTo(map)
    })
  }

  flyTo = location => {
    this.map.flyTo({
      center: [location.longitude, location.latitude],
      bearing: 20,
      zoom: 12,
      pitch: 20
    })
  }

  componentWillUnmount() { this.map.remove() }

  render() {
    return (
      <div id="map-page">
          <ul id="location-list">
              {
                locations.map((loc, i) => {
                  return (
                    <li key={i} onClick={ _ => this.flyTo(loc) }>
                      <h3>{loc.name}</h3>
                    </li>
                  )
                })
              }
          </ul>
          <div id='map' ref={el => this.mapContainer = el} />
      </div>
    )
  }
}


export default Map
