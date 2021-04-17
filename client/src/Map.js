import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Navbar, Button, Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import d from './geojson/16may'

import './Map.css';

const Sidebar = props => {
  return (
    <div id="sidebar" style={{ width: props.width, maxWidth: props.maxWidth, height: props.height, maxHeight: props.maxHeight }}>
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
  const snapshots = ['21_1','17_2']; //Snapshot dates (day_month)

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [snapshotIndex, setSnapshotIndex] = useState(snapshots[0]);


  function valuetext(value) {
    return `${value}`;
  }

  function getSnapshotDate (value) {
    setSnapshotIndex(snapshots[value-1]);
    console.log(snapshotIndex)
  }

  function CurrentSnapshot () {
    return (<TileLayer
      url={`./${snapshotIndex}` + '/{z}/{x}/{y}.png'}
      tms={true}
      //Make these configurable with state
      opacity={overlayOpacity}
      minZoom={12}
      maxZoom={17}
    />)
  }

  console.log(d)

  return (
    <>
      <Navbar bg={'dark'} variant={'dark'}>
        <Navbar.Brand>Geospatial</Navbar.Brand>
      </Navbar>

      <Sidebar header={'Sidebar'} width={'250px'} height={'90vh'}>
        <div>Overlay</div>
        <Typography id="discrete-slider" gutterBottom>
          Opacity
      </Typography>
        <Slider
          defaultValue={1}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={0.1}
          marks
          min={0}
          max={1}
          onChange={(e, value) => setOverlayOpacity(value)}
        />

        <Typography id="discrete-slider" gutterBottom>
          Time-Series
      </Typography>
        <Slider
          defaultValue={1}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={5}
          onChange={(e, value) => getSnapshotDate(value)}
        />

      </Sidebar>
      <MapContainer center={[-43.52953261358661, 172.62224272077717]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <TileLayer
          //Be able to change base layer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CurrentSnapshot />

        <GeoJSON data={d} />

      </MapContainer>

    </>
  );
}

export default Map;
