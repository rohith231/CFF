// react
import React, { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import {transform} from 'ol/proj'
import {toStringXY} from 'ol/coordinate';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import TileWMS from 'ol/source/TileWMS';

function MapWrapper({map,setMap,addFeaturesLayer,featuresLayer}) {

  // set intial state

  const [ selectedCoord , setSelectedCoord ] = useState()
  const [wmslayer,setwmslayer] = useState()

  // pull refs
  const mapElement = useRef()
  
  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef()
  mapRef.current = map

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {

    // create and add vector source layer

    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        
        // USGS Topo
       /*  new TileLayer({
          source: new XYZ({
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
          })
        }), */
        new TileLayer({
          source: new OSM(),
      }),

      ],
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 2
      }),
      controls: []
    })

    // save map and vector layer references to state
    setMap(initialMap)
   /*  addFeaturesLayer(initalFeaturesLayer) */

  },[])

  // update map if features prop changes - logic formerly put into componentDidUpdate
  /*  useEffect( () => {

     if (selectedLayers && selectedLayers.length) { // may be null on first render
       // set features to map
       console.log(selectedLayers,'...select')
       selectedLayers.forEach(layer => {
        featuresLayer.setSource(
          new VectorSource({
              url:layer.wfsurl,
              format: new GeoJSON(), // make sure features is an array
          })
        )
       });
      

       // fit map to feature extent (with 100px of padding)
       map.getView().fit(featuresLayer.getSource().getExtent(), {
         padding: [100,100,100,100]
       })

     }

   },[selectedLayers])
 */
//   // map click handler
  const handleMapClick = (event) => {

    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326')

    // set React state
    setSelectedCoord( transormedCoord )

    console.log(transormedCoord)
    
  }

  // render component
  return (      
    <div ref={mapElement} className="map-container"></div>
  ) 

}

export default MapWrapper