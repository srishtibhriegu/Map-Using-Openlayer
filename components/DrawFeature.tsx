import React, { useEffect } from 'react';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

interface DrawFeatureProps {
  map: Map | undefined;
  drawTypes: ('Point' | 'LineString' | 'Polygon')[];
}

const DrawFeature: React.FC<DrawFeatureProps> = ({ map, drawTypes }) => {
  useEffect(() => {
    console.log('DrawFeature props:', { map, drawTypes });
    if (!map) return;

    const source = new VectorSource();
    const layer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2
          })
        })
      })
    });
    map.addLayer(layer);

    if (!drawTypes || drawTypes.length === 0) return;

    const drawInteractions = drawTypes.map(drawType => {
      return new Draw({
        source: source,
        type: drawType
      });
    });

    drawInteractions.forEach(draw => {
      map.addInteraction(draw);
    });

    return () => {
      drawInteractions.forEach(draw => {
        map.removeInteraction(draw);
      });
      map.removeLayer(layer);
      source.clear();
    };
  }, [map, drawTypes]);

  return null;
};

export default DrawFeature;
