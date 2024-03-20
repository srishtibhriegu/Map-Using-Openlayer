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

    // Create a VectorSource to hold the pinpoint icon as a Feature
    const vectorSource = new VectorSource({
      features: [
        new Feature({
          geometry: new Point([0, 0]) // Placeholder initial position (longitude, latitude)
        })
      ]
    });

    // Create a Style for the pinpoint icon
    const iconStyle = new Style({
      image: new Icon({
        src: placeholderSrc,
        scale: 0.05
      })
    });

    // Apply the style to the pinpoint icon Feature
    vectorSource.getFeatures()[0]?.setStyle(iconStyle);

    // Create a VectorLayer to display the pinpoint icon
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Add the VectorLayer to the map
    map.addLayer(vectorLayer);

    // Store the Feature representing the pinpoint for future updates
    setPinpointFeature(vectorSource.getFeatures()[0]);

    // Create a Translate interaction
    const translateInteraction = new Translate({
      features: new Collection([vectorSource.getFeatures()[0]]), // Pass the feature to be translated
    });

    // Add the Translate interaction to the map
    map.addInteraction(translateInteraction);

    return () => {
      // Clean up the interaction when component unmounts
      map.removeInteraction(translateInteraction);
    };
  }, [map, placeholderSrc]);

  useEffect(() => {
    if (!map || !pinpointFeature) return;

    // Add a click event listener to the map
    const onClick = (event: any) => {
      // Get the clicked coordinate
      const clickedCoord = event.coordinate;
      // Set the coordinate of the pinpoint feature to the clicked coordinate
      pinpointFeature.setGeometry(new Point(clickedCoord));
    };

    map.on('click', onClick);

    return () => {
      // Clean up the event listener when component unmounts
      map.un('click', onClick);
    };
  }, [map, pinpointFeature]);

  return (
    <div id="map" style={{ width: '100%', height: '' }}></div>
  );
};

export default PinpointControl;
