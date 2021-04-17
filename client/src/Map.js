import React, { useEffect, useState } from 'react'
import { MapContainer, MapConsumer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Navbar, Button, Modal } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import axios from 'axios';

import d from './geojson/21_1'

import './Map.css';

const Sidebar = props => {
  return (
    <div id="sidebar" style={{ width: props.width, maxWidth: props.maxWidth, height: props.height, maxHeight: props.maxHeight, overflowY: 'scroll' }}>
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
      '14_2',
      '17_2',
      '19_1',
      '21_1',
    ],
    "rolleston": [
      '15_4',
      '20_9'
    ],
    "rio": [
      '16_5'
    ],
    "mexico_city": [
      'MC'
    ]
  }; //Snapshot dates (day_month)

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [falsecolourOpacity, setFalseColourOpacity] = useState(0);
  const [blendmode, setBlendmode] = useState('color-burn');
  const [city, setCity] = useState('chch_cbd')
  const [snapshotIndex, setSnapshotIndex] = useState(snapshots[city][0]);
  const [falseColourIndex, setFalseColourIndex] = useState(snapshots[city][0]);
  const [prediction, setPrediction] = useState('');
  const [task, setTask] = useState('chip');
  const [coordinates, setCoordinates] = useState([-43.532952, 172.638405,])
  const [falseColourCombination, setCombination] = useState('_a')
  const [snapCombination, setSnapCombination] = useState('')

  const [i, setI] = useState(1)


  function valuetext(value) {
    return `${value}`;
  }

  async function getPrediction() {
    if (task !== 'none') {
      axios.get(`geojson/${snapshotIndex}.json`)
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
    setI(value)
    console.log(date)
    setSnapshotIndex(date);
  }

  function onFalseColourChange(value) {
    const date = snapshots[city][value - 1]
    console.log(date)
    setFalseColourIndex(date);
  }
  function CurrentSnapshot() {
    return (
      <TileLayer
        url={`./cities/${city}/${snapshotIndex}${snapCombination}` + '/{z}/{x}/{y}.png'}
        tms={true}
        opacity={overlayOpacity}
        minZoom={12}
        maxZoom={17}
      />)
  }

  function CurrentOverlay() {
    return (
      <TileLayer
        id={'overlay'}
        url={`./cities/${city}/${falseColourIndex}${falseColourCombination}` + '/{z}/{x}/{y}.png'}
        tms={true}
        opacity={falsecolourOpacity}
        minZoom={12}
        maxZoom={17}
        mixBlendMode={blendmode}
        className={'fcOverlay'}
      />)
  }

  function CurrentPrediction() {
    return task == 'none' ? <div></div> :
      <GeoJSON
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
    const cityname = latlng[2]


    const finalLatLng = [lat, lng]
    setCity(cityname)
    setSnapshotIndex(snapshots[city][0])
    setI(1)
    onFalseColourChange(2)
    setSnapCombination("")
    setCombination("")
    setTask("none")
    setCoordinates([lat, lng])

    console.log(coordinates, 'changed', cityname)
  }

  function handleFalseColour(e) {
    const value = e.currentTarget.dataset.value
    console.log(e.currentTarget)
    let c = document.querySelector('div.leaflet-layer.fcOverlay');
    c.style.mixBlendMode = value
  }

  function handleCombination(e) {
    const value = e.currentTarget.dataset.value
    setCombination(value);
  }

  function handleSnapshot(e) {
    const value = e.currentTarget.dataset.value
    setSnapCombination(value);
  }

  function handleTask(e) {
    const value = e.currentTarget.dataset.value
    setTask(value)
    getPrediction()
  }

  return (
    <>
      <Navbar bg={'dark'} variant={'dark'}>
        <Navbar.Brand>Geospatial</Navbar.Brand>
        <Button className='buttons-coordinates' value={[-43.5968, 172.3840, 'rolleston']} onClick={onClickButton}>Rolleston</Button>
        <Button className='buttons-coordinates' value={[-43.532952, 172.638405, 'chch_cbd']} onClick={onClickButton}>Christchurch CBD</Button>
        <Button className='buttons-coordinates' value={[-22.9550010508, -43.1784265109, 'rio']} onClick={onClickButton}>Rio</Button>
        <Button className='buttons-coordinates' value={[19.36606,-99.18137, 'mexico_city']} onClick={onClickButton}>Mexico City</Button>
      </Navbar>

      <Sidebar width={'250px'} height={'90vh'}>
        <h2 className='sidebar-header'>Snapshot</h2>
        <Typography id="discrete-slider" gutterBottom>
          Opacity
        </Typography>
        <Slider
          defaultValue={i}
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
          defaultValue={i}
          getAriaValueText={valuetext}
          aria-labelledby="time-series"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={snapshots[city].length}
          onChange={(e, value) => onSnapshotChange(value)}
        />

        <InputLabel id="false">False Colour</InputLabel>
        <Select labelId="false" id="select" value="">
          <MenuItem value="" onClick={handleSnapshot}>RGB</MenuItem>
          <MenuItem value="_b" onClick={handleSnapshot}>Vegetation (6,7,4)</MenuItem>
          <MenuItem value="_a" onClick={handleSnapshot}>(8,7,4)</MenuItem>
        </Select>

        <InputLabel id="label">Classification Model</InputLabel>
        <Select labelId="label" id="select" value="none">
          <MenuItem value="none" onClick={handleTask}>None</MenuItem>
          <MenuItem value="chip" onClick={handleTask}>Chip</MenuItem>
          <MenuItem value="sem-seg" onClick={handleTask}>Semantic Segmentation</MenuItem>
        </Select>

        <h2 className='sidebar-header' style={{ paddingTop: '20px' }}>Overlay</h2>
        <Typography id="time-series" gutterBottom>
          Overlay opacity
        </Typography>
        <Slider
          defaultValue={0.5}
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

        <InputLabel id="label">False Colour</InputLabel>
        <Select labelId="label" id="select" value="">
          <MenuItem value="" onClick={handleCombination}>None</MenuItem>
          <MenuItem value="_b" onClick={handleCombination}>Vegetation (6,7,4)</MenuItem>
          <MenuItem value="_a" onClick={handleCombination}>(8,7,4)</MenuItem>
        </Select>

        <InputLabel id="label" style={{ paddingTop: '15px' }}>Blend mode</InputLabel>
        <Select labelId="label" id="select" value="normal">
          <MenuItem value="normal" onClick={handleFalseColour}>None</MenuItem>
          <MenuItem value="difference" onClick={handleFalseColour}>Difference</MenuItem>
          <MenuItem value="color-burn" onClick={handleFalseColour}>Color Burn</MenuItem>
          <MenuItem value="subtract" onClick={handleFalseColour}>Subtract</MenuItem>
        </Select>



      </Sidebar>
      <MapContainer center={[-43.5968, 172.3840]} zoom={16} scrollWheelZoom={true} maxZoom={17} minZoom={12}>
        <MapConsumer>
          {(map) => {
            map.setView(coordinates)
            setSnapshotIndex(snapshots[city][i-1])
            return null
          }}
        </MapConsumer>

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
