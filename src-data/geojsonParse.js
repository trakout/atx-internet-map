const jf = require('jsonfile');
const geolib = require('geolib');

const src = require('./speedtest-mobile-tx.raw.json');


const constrainedRegion = [
    { latitude: 30.962094, longitude: -98.524929 },
    { latitude: 30.980934, longitude: -96.822048 },
    { latitude: 29.597642, longitude: -96.712185 },
    { latitude: 29.588088, longitude: -98.519436 }
];


(async () => {
    const fields = [
        { name: 'Download avg kbps', format: '', type: 'real' },
        { name: 'Upload avg kbps', format: '', type: 'real' },
        { name: 'Latency avg ms', format: '', type: 'real' },
        { name: 'Device count', format: '', type: 'real' },
        { name: 'Test count', format: '', type: 'real' },
        { name: 'latitude', format: '', type: 'real' },
        { name: 'longitude', format: '', type: 'real' }
    ];

    let rows = [];

    for (let i = 0, iLen = src.length; i < iLen; i++) {

        const {
            avg_d_kbps,
            avg_u_kbps,
            avg_lat_ms,
            devices,
            tests
        } = src[i].properties;

        const latlonPolygon = src[i].geometry.coordinates[0].map((c) => {
            return {
                latitude: c[1],
                longitude: c[0]
            }
        });

        const {
            latitude,
            longitude
        } = geolib.getCenterOfBounds(latlonPolygon);

        if (geolib.isPointInPolygon({ latitude, longitude }, constrainedRegion)) {
            rows.push([
                avg_d_kbps,
                avg_u_kbps,
                avg_lat_ms,
                devices,
                tests,
                latitude,
                longitude
            ]);
        }

        
    }

    const jsonResult = { fields, rows };
   
    jf.writeFile(`./speedtest-mobile-tx.json`, jsonResult, function() {
        console.log(`Complete`);
    })
  })();