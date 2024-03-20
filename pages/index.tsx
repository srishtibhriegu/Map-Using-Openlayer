import React,{useEffect, useRef, useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import MapComponent from '../components/MapComponent';
import DrawFeature from '../components/DrawFeature';
import MeasureControl from '../components/MeasureControl';
import PinpointControl from '../components/pinpointControl';
const Home: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | undefined>(undefined);
  
    useEffect(() => {
      if (!mapRef.current) return;
  
      const mapInstance = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
  
      setMap(mapInstance);
    }, []);
  return (
    <div>
      <h1>Map Using OpenLayers</h1>
      <link rel ="stylesheet" href="/style.css"/>
      <MapComponent />
      <DrawFeature map={map} drawTypes={['Point','LineString','Polygon']}  />
      <MeasureControl map ={map} />
      <PinpointControl map={map} placeholderSrc='/placeholder.png' />
    </div>
  );
};

export default Home;
