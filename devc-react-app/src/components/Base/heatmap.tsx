import Map from "@arcgis/core/Map";
import "@arcgis/core/assets/esri/themes/light/main.css";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import ColorVariable from "@arcgis/core/renderers/visualVariables/ColorVariable.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import MapView from "@arcgis/core/views/MapView";
import React, { useEffect, useRef } from "react";
import geoJsonDataRaw from "../../assets/geo.json";
import countryCounts from "../../assets/mockInputs";
import GeoJson from "../interfaces/geojsonInterface";

const HeatmapMap: React.FC = () => { 
    const mapRef = useRef<HTMLDivElement>(null);
    // esriConfig.assetsPath = '/assets/arcgis';

    // const { VITE_MAP_DEFAULT_LAT, VITE_MAP_DEFAULT_LON, VITE_MAP_DEFAULT_SCALE } = import.meta.env;

    const geoJsonData: GeoJson = geoJsonDataRaw as GeoJson;
    for (const feature of geoJsonData.features) {
        const country = feature.properties.COUNTRY;
        feature.properties.Incidents = countryCounts[country];
    };

    const blob = new Blob([JSON.stringify(geoJsonData)], {
        type: "application/json"
    });
    const url = URL.createObjectURL(blob);

    useEffect(() => {
        if (!mapRef.current) return;

        const colorVisVar = new ColorVariable ({
            field: "Incidents",
            stops: [{
                value: 0,
                color: [0, 255, 0, 0.5]
            },
            {
                value: 25,
                color: [173, 255, 47, 0.5]
            },
            {
                value: 50,
                color: [255, 255, 0, 0.5]
            },
            {
                value: 80,
                color: [255, 0, 0, 0.5]
            }],
        });

        const countryRenderer = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                outline: {
                    color: "lightgray",
                    width: 0.5
                }
            }),
            visualVariables: [colorVisVar],
        })

        // const maxIncidentCount = 0;
        // Object.entries(countryCounts).forEach(([country, count], index) => {
        //     console.log(`Element at index ${index}: ${country} has count ${count}`);
        // });

        const geoJSONLayer = new GeoJSONLayer({
            // url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            url: url,
            renderer: countryRenderer
        });

        const map = new Map({
            basemap: "dark-gray",
            layers: [geoJSONLayer]
        })

        map.add(geoJSONLayer);

        const view = new MapView({
            container: mapRef.current,
            map: map,
            ui: {
                components: [],  // removes default widgets
            },
            center: [103.8198, 1.35],
            scale: 150000,
            padding: {
                left: 0
            }
        });
        view.when(() => {
            console.log("Map loaded");
            console.log(view.map.layers);
        }).catch((err) => console.log(err));

        return () => {
            if (view) view.destroy();
        };
    });

    const mapStyles: React.CSSProperties = {
        width: "1920px",
        height: "1080px",
        top: "0px",
        left: "0px",
    }

    return <div id="mapClass" style={mapStyles} ref={mapRef}></div>;

};

export default HeatmapMap;