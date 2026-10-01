import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapCenterListener({ setPosition }: { setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    moveend(e) {
      const map = e.target;
      const center = map.getCenter();
      setPosition([center.lat, center.lng]);
    },
  });
  return null;
}

export default function MapPicker({ 
  position, 
  setPosition 
}: { 
  position: [number, number]; 
  setPosition: (p: [number, number]) => void; 
}) {
  return (
    <MapContainer 
      center={position} 
      zoom={16} 
      scrollWheelZoom={true}
      className="h-[300px] w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterListener setPosition={setPosition} />
      {/* Marcador central fixo indicando a seleção */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[41px] z-[400] pointer-events-none">
        <img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" alt="pin" className="w-[25px] h-[41px]" />
      </div>
    </MapContainer>
  );
}
