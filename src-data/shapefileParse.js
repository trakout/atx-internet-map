// filter out coords by polygon region and write them to JSON 

const shapefile = require('shapefile');
// const reverse = require('reverse-geocode');
const geolib = require('geolib');
const jf = require('jsonfile');

const targetRegion = 'tx';

// taken from https://www.doogal.co.uk/polylines.php

// larger TX region:
const targetBounds = [
  { latitude: 33.336595, longitude: -100.181417 },
  { latitude: 33.079216, longitude: -94.468527 },
  { latitude: 29.474618, longitude: -94.029074 },
  { latitude: 25.062323, longitude: -97.588644 },
  { latitude: 30.540131, longitude: -104.026632 },
  { latitude: 33.336595, longitude: -100.269308 }
]

// square constrained/smaller TX region around ATX:
// const targetBounds = [
//   { latitude: 31.809064, longitude: -99.368429 },
//   { latitude: 31.939679, longitude: -96.292257 },
//   { latitude: 29.254399, longitude: -96.116476 },
//   { latitude: 29.196872, longitude: -99.280538 },
//   { latitude: 31.790389, longitude: -99.45632 }
// ];

// alaska
// const targetBounds = [
//   { latitude: 72.602602, longitude: -175.722808 },
//   { latitude: 73.171522, longitude: -137.402495 },
//   { latitude: 52.793624, longitude: -141.093901 },
//   { latitude: 53.111334, longitude: -175.371245 },
// ]

const fixedFiles = [
  'ookla/shapefiles/performance/type=fixed/year=2020/quarter=1/gps_fixed_tiles.shp',
  'ookla/shapefiles/performance/type=fixed/year=2020/quarter=2/gps_fixed_tiles.shp',
  'ookla/shapefiles/performance/type=fixed/year=2020/quarter=3/gps_fixed_tiles.shp'
]

const mobileFiles = [
  'ookla/shapefiles/performance/type=mobile/year=2020/quarter=1/gps_mobile_tiles.shp',
  'ookla/shapefiles/performance/type=mobile/year=2020/quarter=2/gps_mobile_tiles.shp',
  'ookla/shapefiles/performance/type=mobile/year=2020/quarter=3/gps_mobile_tiles.shp'
]

let jsonResult = { fixed: [], mobile: [] };
let resultCount = { fixed: 0, mobile: 0 };
let rowCount = { fixed: 0, mobile: 0 };

const parseShapefile = (filePath, type) => {
  return new Promise((resolve) => {
    console.log(`Started parsing ${filePath}`);
    shapefile.open(filePath)
    .then(source => source.read()
      .then(function next(result) {

        if (result.done) {
          console.log(`Finished parsing ${filePath}`);
          return resolve();
        };

        // console.log(result.value);
        if (result.value.geometry.type !== 'Polygon') {
          console.log('Unexpected geometry type')
          console.log(result.value.geometry)
          process.exit(0)
        }

        const coordArr = result.value.geometry.coordinates[0];
        if (coordArr.length < 1) {
          console.log('Invalid Coords:', result.value);
          process.exit(-1);
        }

        let isTargetState = false;
        for (let i = 0, iLen = coordArr.length; i < iLen; i++) {
          if (
            geolib.isPointInPolygon({ latitude: coordArr[i][1], longitude: coordArr[i][0] }, targetBounds)
          ) {
            isTargetState = true;
            resultCount[type]++;

            // const lookup = reverse.lookup(
            //   coordArr[i][1], 
            //   coordArr[i][0], 
            //   'us'
            // );
  
            // if (lookup.state === 'Texas') {
            //   console.log(coordArr)
            // }
          }
        }

        if (isTargetState) {
          jsonResult[type].push(result.value);
        }

        rowCount[type]++;
        if (rowCount[type] % 100000 == 0) {
          console.log(`Rows parsed (${type}): ${rowCount[type]}`)
        }

        return source.read().then(next);
      }))
    .catch(error => console.error(error.stack));
  })
}



(async () => {
  await Promise.all([
    // Promise.all(fixedFiles.map(f => parseShapefile(f, 'fixed'))),
    Promise.all(mobileFiles.map(f => parseShapefile(f, 'mobile')))
  ]);

  // jf.writeFile(`./speedtest-fixed-${targetRegion}.json`, jsonResult.fixed, function() {
  //   console.log(`Completed fixed result, ${resultCount.fixed} data points found`)
  // })
  jf.writeFile(`./speedtest-mobile-${targetRegion}.json`, jsonResult.mobile, function() {
    console.log(`Complete mobile result, ${resultCount.mobile} data points found`)
  })
})();
 





