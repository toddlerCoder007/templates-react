import { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Collection from "@arcgis/core/core/Collection";
import Point from "@arcgis/core/geometry/Point";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Color from "@arcgis/core/Color";

const HeatmapMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapRef.current) return;

    async function fetchPolygonData() {
      const url =
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.features; // Return only the feature array
      } catch (error) {
        console.error("Error fetching polygon data:", error);
        return [];
      }
    }

    // 🎨 Heatmap Renderer (Adjust Field Based on Your Data)
    const heatmapRenderer = new ClassBreaksRenderer({
      field: "POPULATION", // Change to a relevant field
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 1000000,
          symbol: new SimpleFillSymbol({
            color: new Color([255, 245, 235, 0.7]), // Lightest shade
            outline: { color: "white", width: 0.5 },
          }),
        },
        {
          minValue: 1000000,
          maxValue: 10000000,
          symbol: new SimpleFillSymbol({
            color: new Color([252, 187, 161, 0.7]), // Light Orange
            outline: { color: "white", width: 0.5 },
          }),
        },
        {
          minValue: 10000000,
          maxValue: 50000000,
          symbol: new SimpleFillSymbol({
            color: new Color([251, 106, 74, 0.7]), // Medium Orange
            outline: { color: "white", width: 0.5 },
          }),
        },
        {
          minValue: 50000000,
          maxValue: 200000000,
          symbol: new SimpleFillSymbol({
            color: new Color([203, 24, 29, 0.7]), // Dark Red
            outline: { color: "white", width: 0.5 },
          }),
        },
      ],
    });

    // const heatmapRenderer = {
    //   type: "heatmap",
    //   colorStops: [
    //     { color: "rgba(115, 0, 115, 0)", ratio: 0 },
    //     { color: "rgba(0, 255, 255, 0.5)", ratio: 0.1 },
    //     { color: "rgba(0, 0, 255, 0.7)", ratio: 0.3 },
    //     { color: "rgba(0, 255, 0, 0.9)", ratio: 0.5 },
    //     { color: "rgba(255, 255, 0, 1)", ratio: 0.7 },
    //     { color: "rgba(255, 0, 0, 1)", ratio: 1 },
    //   ],
    //   radius: 18,
    //   maxDensity: 0.04625,
    //   minDensity: 0,
    // };

    // 🎯 Function to Create Feature Layer from API Data
    async function createFeatureLayerFromAPI() {
      const polygonFeatures = await fetchPolygonData();

      interface Feature {
        geometry: any;
        attributes: any;
      }

      const featureLayer = new FeatureLayer({
        source: polygonFeatures.map((feature: Feature, index: number) => ({
          geometry: feature.geometry,
          attributes: { objectId: index, ...feature.attributes },
        })),
        objectIdField: "objectId",
        fields: [
          { name: "objectId", type: "oid" },
          { name: "POPULATION", type: "double" },
        ], // Adjust fields accordingly
        geometryType: "polygon",
        renderer: heatmapRenderer, // Apply heatmap-style color rendering
      });

      return featureLayer;
    }

    const webMap = new WebMap({
      basemap: "dark-gray",
    });

    let view: MapView;
    async function initializeMap() {
      const map = webMap;
      view = new MapView({
        container: mapRef.current,
        map: webMap,
        center: [103.825, 1.29883], // Singapore
        zoom: 12,
        constraints: {
          snapToZoom: false, // Prevents automatic zooming
          rotationEnabled: false, // Disables map rotation
        },
      });
    
      const featureLayer = await createFeatureLayerFromAPI();
      map.add(featureLayer);
    }

    initializeMap();

    return () => {
      view.destroy();
    };
  }, []);

  const mapStyles: React.CSSProperties = {
    width: "100%",
    height: "600px",
    minWidth: "800px", // Prevents shrinking too much
    // maxWidth: "1920x", // Optional limit
  };

  return <div style={mapStyles} ref={mapRef}></div>;
};

export default HeatmapMap;
