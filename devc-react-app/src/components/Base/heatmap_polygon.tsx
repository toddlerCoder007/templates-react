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

        // add function that takes in lat lon from the geoJSON and draws rings for each country
        // const drawRings = (features: any[]) => {
        //     features.forEach((feature) => {
        //       const geometry = feature.geometry;
        //       const symbol = new SimpleFillSymbol({
        //         color: "rgba(0, 0, 0, 0.5)",
        //         outline: {
        //           color: "black",
        //           width: 1,
        //         },
        //       });

        // const polygonGeometry = new Polygon({
        //     rings: [
        //         [
        //             // 🏗️ Tuas & West
        //             [103.600, 1.270],  // Tuas South
        //             [103.635, 1.292],  // Tuas
        //             [103.680, 1.330],  // Sungei Kadut
        //             [103.710, 1.410],  // Lim Chu Kang (Northernmost part)
        //             [103.760, 1.420],  // Kranji (Sungei Buloh Wetland)

        //             // 🏡 North (Woodlands, Sembawang)
        //             [103.810, 1.405],  // Woodlands (Causeway to Malaysia)
        //             [103.860, 1.435],  // Sembawang (Near JB Straits)

        //             // 🌴 Northeast (Pulau Ubin, Changi)
        //             [103.995, 1.425],  // Pulau Ubin (North-East Island)
        //             [104.050, 1.390],  // Changi (East)
        //             [104.060, 1.360],  // Changi South
        //             [104.040, 1.320],  // Tanah Merah

        //             // 🌆 South (City, Sentosa, Labrador)
        //             [104.000, 1.290],  // Marina Bay
        //             [103.950, 1.260],  // Sentosa
        //             [103.880, 1.250],  // Labrador Park
        //             [103.820, 1.265],  // Pasir Panjang
        //             [103.760, 1.275],  // Jurong Island
        //             [103.700, 1.280],  // Pioneer

        //             // 🌾 Back to Lim Chu Kang & Tuas
        //             [103.650, 1.300],  // Lim Chu Kang Road
        //             [103.620, 1.280],  // Tengah Airbase area
        //             [103.600, 1.270]   // Tuas South
        //         ],
        //         [
        //             [99.6, 6.5],  // Northwest (Perlis - near Thailand)
        //             [100.2, 6.4], // Kedah (Langkawi)
        //             [100.4, 5.8], // Penang
        //             [101.0, 5.5], // Perak (West coast)
        //             [102.0, 5.7], // Kelantan (East coast near Thailand)
        //             [103.2, 4.8], // Terengganu (Near Redang)
        //             [104.0, 3.8], // Pahang (Kuantan)
        //             [104.1, 2.6], // Johor (Mersing)
        //             [103.6, 1.5], // Johor Bahru (near Singapore)
        //             [102.6, 2.2], // Malacca
        //             [101.8, 2.6], // Negeri Sembilan
        //             [101.4, 3.2], // Selangor (Port Klang)
        //             [101.7, 3.4], // Kuala Lumpur
        //             [101.0, 3.8], // Pahang (Bentong)
        //             [100.6, 4.5], // Perak (Taiping)
        //             [100.4, 5.3], // Kedah (Alor Setar)
        //             [99.6, 6.5]
        //         ]
        //     ],
        //     spatialReference: { wkid: 4326 }
        // })

        // const renderer = new SimpleRenderer({
        //     symbol: new SimpleFillSymbol({
        //         color: [255, 0, 0, 0.25],
        //         outline: null
        //     })
        // })

        // const polygonGraphic = new Graphic({
        //     geometry: polygonGeometry,
        // });

        // const graphicCollection = new Collection<Graphic>();
        // graphicCollection.add(polygonGraphic);

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
        })

        // const featureLayer = new FeatureLayer({
        //     source: graphicCollection,
        //     objectIdField: "ObjectID",
        //     fields: [
        //         { name: "ObjectID", alias: "Object ID", type: "oid" }
        //     ],
        //     geometryType: "polygon",
        //     spatialReference: { wkid: 4326 },
        //     renderer: renderer
        // })

        // map.add(featureLayer);

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
    }, []);

    const mapStyles: React.CSSProperties = {
        width: "1920px",
        height: "1080px",
        top: "0px",
        left: "0px",
        // paddingLeft: "0px",
        // paddingTop: "0px"
    }

    return <div id="mapClass" style={mapStyles} ref={mapRef}></div>;

};

export default HeatmapMapPolygon;