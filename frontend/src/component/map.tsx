import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useWindowSize } from '../hook';

import { default as mapConfig } from '../asset/keplerConfig.json';
import { default as fixedData } from '../asset/speedtest-fixed-tx.json';
import { default as mobileData } from '../asset/speedtest-mobile-tx.json';

export const Map = (props: any) => {
    
    const store = useStore();
    const size = useWindowSize();

    useEffect(() => { 

        store.dispatch(
            addDataToMap({
                datasets: [
                    {
                        info: {
                            label: ' ATX Fixed Internet Speeds 2020',
                            id: 'atx-internet-speed-fixed'
                        },
                        data: fixedData
                    },
                    {
                        info: {
                            label: ' ATX Mobile Internet Speeds 2020',
                            id: 'atx-internet-speed-mobile'
                        },
                        data: mobileData
                    }
                ],
                option: {
                    centerMap: false,
                    readOnly: false
                },
                config: mapConfig
            })
        );
    }, [store]);


    return (
        <KeplerGl
            id="map"
            appName="ATX Internet Speed/Latency Map"
            width={size.width}
            height={size.height}
            mapboxApiAccessToken={process.env.REACT_APP_MB}
        />
    );
};