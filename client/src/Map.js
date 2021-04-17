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
  const snapshots = {
    "chch_cbd": [
      '11_3',
      '13_1',
      '19_1',
      '21_1',
      '14_2',
      '17_2',
    ],
    "rolleston": [
      '15_4',
      '20_9'
    ],
    "rio": [
      '16_5'
    ]
  }; //Snapshot dates (day_month)

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [falsecolourOpacity, setFalseColourOpacity] = useState(0);
  const [blendmode, setBlendmode] = useState('color-burn');
  const [city, setCity] = useState('rolleston')
  const [snapshotIndex, setSnapshotIndex] = useState(snapshots[city][0]);
  const [falseColourIndex, setFalseColourIndex] = useState(snapshots[city][0]);
  const [prediction, setPrediction] = useState('');
  const [task, setTask] = useState('chip');
  const [coordinates, setCoordinates] = useState([-43.52953261358661, 172.62224272077717])



  function valuetext(value) {
    return `${value}`;
  }

  async function getPrediction(date) {
    if (task !== 'none') {
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
  }

  function onSnapshotChange(value) {
    const date = snapshots[city][value - 1]
    console.log(date)
    setSnapshotIndex(date);
    getPrediction(date);
  }

  function onFalseColourChange(value) {
    const date = snapshots[city][value - 1]
    console.log(date)
    setFalseColourIndex(date);
  }
  function CurrentSnapshot() {
    return (
      <TileLayer
        url={`./cities/${city}/${snapshotIndex}_a` + '/{z}/{x}/{y}.png'}
        tms={true}
        opacity={overlayOpacity}
        minZoom={12}
        maxZoom={17}
      />)
  }

  function CurrentOverlay() {
    return (
      <TileLayer
        url={`./cities/${city}/${falseColourIndex}_b` + '/{z}/{x}/{y}.png'}
        tms={true}
        opacity={falsecolourOpacity}
        minZoom={12}
        maxZoom={17}
        mixBlendMode={blendmode}
        className={'fcOverlay'}
      />)
  }

  function CurrentPrediction() {
    return prediction == '' ? <div></div> : <GeoJSON
      data={prediction}
      style={(feature) => {
        switch (feature.properties["class_name"]) {
          case 'building': return { color: "#ff0000" };
          case 'no_building': return { color: "#0000ff" };
        }
      }}
    />
  }

  function onClickButton(e) {
    const latlng = e.target.value.split(',')
    const lat = Number(latlng[0])
    const lng = Number(latlng[1])

    const finalLatLng = [lat, lng]

    setCoordinates([lat, lng])
    MapContainer.panTo(finalLatLng)
    console.log(coordinates, 'changed')
  }

  return (
    <>
      <Navbar bg={'dark'} variant={'dark'}>
        <Navbar.Brand>Geospatial</Navbar.Brand>
        <Button className='buttons-coordinates' value={[]} onClick={onClickButton}>Rollerston</Button>
        <Button className='buttons-coordinates' value={[-43.52953261358661, 172.62224272077717]} onClick={onClickButton}>Christchurch CBD</Button>
        <Button className='buttons-coordinates' value={[]} onClick={onClickButton}>Auckland CBD</Button>
        <Button className='buttons-coordinates' value={[-22.9550010508, -43.1784265109]} onClick={onClickButton}>Rio</Button>
      </Navbar>

      <Sidebar width={'250px'} height={'90vh'}>
        <h2 className='sidebar-header'>Overlays</h2>
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
          max={snapshots[city].length}
          onChange={(e, value) => onSnapshotChange(value)}
        />


        <InputLabel id="label">False Colour overlay</InputLabel>
        <Select labelId="label" id="select" value="0">
          <MenuItem value="0">None</MenuItem>
          <MenuItem value="10">Vegetation</MenuItem>
          <MenuItem value="20"></MenuItem>
        </Select>
        <Slider
          defaultValue={0}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={0.1}
          marks
          min={0}
          max={1}
          onChange={(e, value) => {
            setFalseColourOpacity(value)
            setBlendmode('color-burn')
          }}
        />

        <InputLabel id="label">False Colour</InputLabel>
        <Select labelId="label" id="select" value="0">
          <MenuItem value="0">None</MenuItem>
          <MenuItem value="10">Vegetation</MenuItem>
          <MenuItem value="20"></MenuItem>
        </Select>
        <Slider
          defaultValue={1}
          getAriaValueText={valuetext}
          aria-labelledby="time-series"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={snapshots[city].length}
          onChange={(e, value) => onFalseColourChange(value)}
        />


        <InputLabel id="label">Classification Model</InputLabel>
        <Select labelId="label" id="select" value="0">
          <MenuItem value="0">None</MenuItem>
          <MenuItem value="10">Chip</MenuItem>
          <MenuItem value="20">Semantic Segmentation</MenuItem>
        </Select>

      </Sidebar>
      <MapContainer center={[-43.5968, 172.3840]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <TileLayer
          //Be able to change base layer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CurrentSnapshot />
        <CurrentOverlay />
        <CurrentPrediction />

      </MapContainer>

    </>
  );
}

export default Map;
