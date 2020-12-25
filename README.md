## ATX Internet Speed & Latency Map

[Check out the Demo](https://trakout.github.io/atx-internet-map)

#### /frontend
* Typescript+React w/ react-create-app
* [kepler.gl](https://github.com/keplergl/kepler.gl)
* [Mapbox](https://docs.mapbox.com/)

#### Methodology: /src-data 
* Data Source is from Ookla's open speedtest data
    * `aws s3 sync s3://ookla-open-data/ --no-sign-request ./src-data/ookla`
* shapefiles parsed & filtered by polygon: `node shapefileParse.js`
* data optimized: `node geojsonParse.js`
* result is used by frontend