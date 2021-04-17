#!/bin/bash

gdalbuildvrt -b $1 -b $2 -b $3 $4.vrt $5
wait
gdal_translate -of VRT -ot Byte -scale $4.vrt $4_output.vrt
wait
python ./gdal2tilesp.py $4_output.vrt




