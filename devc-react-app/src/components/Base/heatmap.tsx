import Map from "@arcgis/core/Map";
import "@arcgis/core/assets/esri/themes/light/main.css";
// import esriConfig from "@arcgis/core/config";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer";
import MapView from "@arcgis/core/views/MapView";
import React, { useEffect, useRef, useState } from "react";
// import dataJson from "../../assets/data.json";
import geoJson from "../../assets/geo.json";

interface HeatmapMapPolygonProps {
    countryColors: { [key: string]: [number, number, number, number] };
}

const HeatmapMap: React.FC<HeatmapMapPolygonProps> = ({ countryColors }) => { 
    const mapRef = useRef<HTMLDivElement>(null);
    // esriConfig.assetsPath = '/assets/arcgis';
    const [dataBlobUrl, setDataBlobUrl] = useState<string | null>(null);
    const [data, setData] = useState<Record<string, number>>({});
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        async function fetchData() {
            const controller = new AbortController();
            abortController.current = controller;

            try {
                const response = await fetch("/data.json", { signal: controller.signal });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error: unknown) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error loading data.json:", error);
                }
            }
        }

        fetchData();
        return () => abortController.current?.abort();
    }, []);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             // ✅ Fetch External JSON (data.json)
    //             const response = await fetch("/data.json");
    //             const data = await response.json();

    //             // ✅ Convert JSON to a Blob
    //             const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    //             const blobUrl = URL.createObjectURL(blob);

    //             console.log("Data Blob URL:", blobUrl);
    //             setDataBlobUrl(blobUrl); // ✅ Store Blob URL in State
    //         } catch (error) {
    //             console.error("Error loading data.json:", error);
    //         }
    //     }

    //     fetchData();
    // }, []);

    useEffect(() => {
        if (!mapRef.current || !dataBlobUrl) return;

        abortController.current = new AbortController();  // ✅ Create an abort controller
        // const signal = abortController.current.signal;

        const heatmapRenderer = new HeatmapRenderer({
            field: "value",
            colorStops: [
                { ratio: 0, color: "rgba(255, 255, 255, 0)" },  // Transparent (0)
                { ratio: 0.1, color: "rgba(0, 255, 255, 0.8)" },  // Light Blue (10)
                { ratio: 0.3, color: "rgba(0, 191, 255, 0.8)" },  // Cyan (30)
                { ratio: 0.5, color: "rgba(0, 128, 255, 0.8)" },  // Deep Blue (50)
                { ratio: 0.7, color: "rgba(255, 165, 0, 0.8)" },  // Orange (70)
                { ratio: 0.9, color: "rgba(255, 69, 0, 0.9)" },  // Dark Orange (90)
                { ratio: 1, color: "rgba(255, 0, 0, 1)" }  // 🔥 Red (100)
            ],
            maxDensity: 100,
            minDensity: 0
        });

        const geojson = geoJson;
        const blob = new Blob([JSON.stringify(geojson)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const geoJSONLayer = new GeoJSONLayer({
            // url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            url: url,
        });

        geoJSONLayer.when(() => {
            geoJSONLayer.queryFeatures().then(async (results) => {
                // ✅ Fetch JSON Data from Blob URL
                const response = await fetch(dataBlobUrl);
                const externalData = await response.json();

                results.features.forEach((feature) => {
                    const countryName = feature.attributes.COUNTRY;
                    feature.attributes.data_value = externalData[countryName] || 0;  // ✅ Inject Data
                });

                // geoJSONLayer.applyEdits({ updateFeatures: results.features });  // ✅ Apply Changes
                geoJSONLayer.renderer = heatmapRenderer;  // ✅ Apply Heatmap Rendering
            });
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
            abortController.current?.abort();  // ✅ Abort previous requests on unmount
            if (view) view.destroy();
        };
    }, [countryColors, dataBlobUrl]);

    const mapStyles: React.CSSProperties = {
        width: "1920px",
        height: "1080px",
        top: "0px",
        left: "0px",
    }

    return <div id="mapClass" style={mapStyles} ref={mapRef}></div>;

};

export default HeatmapMap;