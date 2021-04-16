import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Navbar, Button, Modal } from 'react-bootstrap';
import './Map.css';
import { Children } from 'react';

const Sidebar = props => {
  return (
    <div id="sidebar" style={{ width: props.width, maxWidth: props.maxWidth }}>
      <div class="sidebar-wrapper">
        <div id="features" class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">{props.header}</h3>
          </div>
          {props.children}
        </div>
      </div>
    </div>)
}


function Map() {

  return (
    <>
      <Navbar bg={'dark'} variant={'dark'}>
        <Navbar.Brand>Geospatial</Navbar.Brand>
      </Navbar>

      <Sidebar header={'Sidebar'} width={'200px'}>
        <div>asdasd</div>
      </Sidebar>

      <MapContainer center={[-22.9550010508, -43.1784265109]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <TileLayer
        //Be able to change base layer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <TileLayer
          url='./{z}/{x}/{y}.png'
          tms={true}
          //Make these configurable with state
          opacity={1}
          minZoom={12}
          maxZoom={17}
        />
      </MapContainer>

    </>
  );
}

export default Map;
