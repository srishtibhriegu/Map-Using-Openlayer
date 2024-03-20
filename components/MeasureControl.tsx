import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';
import { LineString, Polygon } from 'ol/geom';

interface MeasureControlProps {
  map: Map | undefined;
}

const MeasureControl: React.FC<MeasureControlProps> = ({ map }) => {
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  useEffect(() => {
    if (!map) return;
 
    const overlay = new Overlay({
      element: document.createElement('div'),
      autoPan: false,
      autoPanAnimation: {
        duration: 250,
      },
    });

    map.addOverlay(overlay);
    setOverlay(overlay);

    map.on('pointermove', (event) => {
      if (!overlay || !overlay.getElement()|| !map) return;

      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof LineString) {
          const length = getLength(geometry);
          overlay.getElement()!.innerHTML = `Length: ${length.toFixed(2)} meters`;
        } else if (geometry instanceof Polygon) {
          const area = getArea(geometry);
          overlay.getElement()!.innerHTML = `Area: ${area.toFixed(2)} square meters`;
        }
        overlay.setPosition(event.coordinate);
        overlay.getElement()!.style.display = 'block';
      } else {
        overlay.setPosition(undefined);
        overlay.getElement()!.style.display = 'none';
      }
    });

    return () => {
      if(overlay){
      map.removeOverlay(overlay);
      }
    };
  }, [map]);

  return null;
};

export default MeasureControl;
