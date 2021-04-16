import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css';

function Map() {

  return (
    <>
    <div>deez</div>
      <MapContainer center={[-22.9550010508, -43.1784265109]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer 
          url='./{z}/{x}/{y}.png'
          tms={true}
          opacity={1}
          minZoom={12}
          maxZoom={17}
        />
      </MapContainer>
    </>
  );
}

export default Map;
