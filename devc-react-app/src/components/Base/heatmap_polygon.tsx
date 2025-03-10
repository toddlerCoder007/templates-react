import Map from "@arcgis/core/Map";
import "@arcgis/core/assets/esri/themes/light/main.css";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import MapView from "@arcgis/core/views/MapView";
import React, { useEffect, useRef } from "react";
import geoJson from "./geo.json";

import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

interface HeatmapMapPolygonProps {
    countryColors: { [key: string]: [number, number, number, number] };
}

const HeatmapMapPolygon: React.FC<HeatmapMapPolygonProps> = ({ countryColors }) => { 
    const mapRef = useRef<HTMLDivElement>(null);
    // esriConfig.assetsPath = '/assets/arcgis';

    useEffect(() => {
        if (!mapRef.current) return;

        const uniqueValueInfos = Object.entries(countryColors).map(([country, color]) => ({
            value: country,
            symbol: new SimpleFillSymbol({ color })
        }));

        const countryRenderer = new UniqueValueRenderer({
            field: "COUNTRY",
            uniqueValueInfos: uniqueValueInfos,
            defaultSymbol: new SimpleFillSymbol({ color: [200, 200, 200, 0.5] })
        });

        const geojson = geoJson;
        const blob = new Blob([JSON.stringify(geojson)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const geoJSONLayer = new GeoJSONLayer({
            // url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            url: url,
            renderer: countryRenderer
        });

        // const basemap = new Basemap({
        //     baseLayers: [
        //         new WMTSLayer({
        //             url: 'https://localhost:8080/styles/basic-preview/wmts.xml'
        //         })
        //     ]
        // })

        const map = new Map({
            basemap: "dark-gray",
            layers: [geoJSONLayer]
        });

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
    }, [countryColors]);

    const mapStyles: React.CSSProperties = {
        width: "1920px",
        height: "1080px",
        top: "0px",
        left: "0px",
    }

    return <div id="mapClass" style={mapStyles} ref={mapRef}></div>;

};

export default HeatmapMapPolygon;