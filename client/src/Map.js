import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Navbar, Button, Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

import d from './geojson/21_1'

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
  const snapshots = [
    '11_3',
    '13_1',
    '19_1',
    '21_1',
    '14_2',
    '17_2',
  ]; //Snapshot dates (day_month)

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [snapshotIndex, setSnapshotIndex] = useState(snapshots[0]);
  const [prediction, setPrediction] = useState(d);
  const [task, setTask] = useState('chip');

  function valuetext(value) {
    return `${value}`;
  }

  async function getPrediction(date) {

    axios.get(`geojson/${date}.json`)
      .then(res => {
        console.log(res.data)
        setPrediction(res.data);
      })
      .catch((err) => {
        console.log(err)
        setPrediction('')
      })


  }

  function onSnapshotChange(value) {
    const date = snapshots[value - 1]
    console.log(date)
    setSnapshotIndex(date);
    getPrediction(date);
  }

  function CurrentSnapshot() {
    return (
      <TileLayer
        url={`./${snapshotIndex}` + '/{z}/{x}/{y}.png'}
        tms={true}
        //Make these configurable with state
        opacity={overlayOpacity}
        minZoom={12}
        maxZoom={17}
      />)
  }

  function CurrentPrediction() {
    return (<GeoJSON
      data={prediction}
      style={(feature) => {
        switch (feature.properties["class_name"]) {
          case 'building': return { color: "#ff0000" };
          case 'no_building': return { color: "#0000ff" };
        }
      }}
    />)
  }

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

        <Typography id="time-series" gutterBottom>
          Time-Series
        </Typography>
        <Slider
          defaultValue={1}
          getAriaValueText={valuetext}
          aria-labelledby="time-series"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={snapshots.length}
          onChange={(e, value) => onSnapshotChange(value)}
        />

        <InputLabel id="label">Classification Model</InputLabel>
        <Select labelId="label" id="select" value="0">
          <MenuItem value="0">None</MenuItem>
          <MenuItem value="10">Chip</MenuItem>
          <MenuItem value="20">Semantic Segmentation</MenuItem>
        </Select>

      </Sidebar>
      <MapContainer center={[-43.52953261358661, 172.62224272077717]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <TileLayer
          //Be able to change base layer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CurrentSnapshot />
        <CurrentPrediction />

      </MapContainer>

    </>
  );
}

export default Map;
