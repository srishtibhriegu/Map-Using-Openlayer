import React, { useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import PinpointControl from './pinpointControl';
import DrawFeature from './DrawFeature';
import MeasureControl from './MeasureControl';

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const newMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM({  
            attributions: [],
          })
        }),
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: '/data/states.geojson'
          })
        }),
        new VectorLayer({
          source: new VectorSource()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    setMap(newMap);

    return () => {
      newMap.setTarget();
    };
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '900px' }}>
      {map && (
        <>
          <DrawFeature map={map} drawTypes={['Point', 'LineString','Polygon']}/> 
          <PinpointControl map={map} placeholderSrc='/placeholder.png' /> 
          <MeasureControl map={map} /> 
        </>
      )}
    </div>
  );
};

export default MapComponent;
