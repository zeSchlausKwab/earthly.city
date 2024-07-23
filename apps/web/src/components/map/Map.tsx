"use client"

import 'leaflet/dist/leaflet.css';
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { GeomanControl } from './GeomanControl';
import Events from './Events';
import { GeoSearchControlComponent } from './GeoSearch';


const Map = () => {


    return (
        <>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=FTejVijNkqKWPbQui8i9"
                />

                <GeomanControl position="topleft" oneBlock />
                <Events />
                <GeoSearchControlComponent />
            </MapContainer>
        </>
    );
};

export default Map;