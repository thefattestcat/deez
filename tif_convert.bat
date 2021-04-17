call "C:\OSGeo4W64\bin\gdalbuildvrt" -b %1 -b %2 -b %3 %4.vrt %5

call "C:\OSGeo4W64\bin\gdal_translate" -of VRT -ot Byte -scale %4.vrt %4_output.vrt

call "python" "C:\OSGeo4W64\bin\gdal2tilesp.py" %4_output.vrt  




