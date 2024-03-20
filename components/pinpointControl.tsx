//code for place a placeholder in map
import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Collection } from 'ol';
import { Translate } from 'ol/interaction';

interface PinpointProps {
  map: Map | undefined;
  placeholderSrc: string;
}

const PinpointControl: React.FC<PinpointProps> = ({ map, placeholderSrc }) => {
  const [pinpointFeature, setPinpointFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (!map) return;

    
    const vectorSource = new VectorSource({
      features: [
        new Feature({
          geometry: new Point([0, 0]) // Placeholder initial position (longitude, latitude)
        })
      ]
    });

    const iconStyle = new Style({
      image: new Icon({
        src: placeholderSrc,
        scale: 0.05
      })
    });
    vectorSource.getFeatures()[0]?.setStyle(iconStyle);

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });


    map.addLayer(vectorLayer);

    setPinpointFeature(vectorSource.getFeatures()[0]);

    const translateInteraction = new Translate({
      features: new Collection([vectorSource.getFeatures()[0]]), 
    });

    map.addInteraction(translateInteraction);

    return () => {
      map.removeInteraction(translateInteraction);
    };
  }, [map, placeholderSrc]);

  useEffect(() => {
    if (!map || !pinpointFeature) return;

    const onClick = (event: any) => {
      const clickedCoord = event.coordinate;
      pinpointFeature.setGeometry(new Point(clickedCoord));
    };

    map.on('click', onClick);

    return () => {
      map.un('click', onClick);
    };
  }, [map, pinpointFeature]);

  return (
    <div id="map" style={{ width: '100%', height: '' }}></div>
  );
};

export default PinpointControl;
