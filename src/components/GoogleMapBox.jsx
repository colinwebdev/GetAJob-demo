// Geocode docs: https://www.npmjs.com/package//react-geocode
// React-Google-Maps: https://visgl.github.io/react-google-maps/docs

import { setKey, fromAddress } from 'react-geocode'
import {
    APIProvider,
    AdvancedMarker,
    Map,
    Pin,
} from '@vis.gl/react-google-maps'
import Spinner from './Spinner'

import { useState, useEffect } from 'react'

function GoogleMapBox({ address }) {
    let [latLong, setLatLong] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let [isFail, setIsFail] = useState(false)
    let position = { lat: latLong[0], lng: latLong[1] }

    setKey(process.env.REACT_APP_GOOGLE_MAPS_KEY)
    
    if (!address) {
        address = '';
    }
    
    useEffect(() => {
        fromAddress(address)
            .then(({ results }) => {
                let { lat, lng } = results[0].geometry.location
                setLatLong([lat, lng])
                setIsLoading(false)
            })
            .catch((err) => {
                setIsFail(true)
            })
    }, [])

    if (isFail)
        return (
            <div className='noMap'>
                <h2>Could not retrieve map</h2>
            </div>
        )

    if (isLoading) return <Spinner />

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
            <div className='map'>
                <Map
                    zoom={15}
                    center={position}
                    mapId={'8a17d3fc23589984'}
                    disableDefaultUI={true}
                >
                    <AdvancedMarker position={position}>
                        <Pin
                            background={'#8650d4'}
                            borderColor={'#fff'}
                            glyphColor={'#ecf7ff'}
                            scale={1.5}
                        />
                    </AdvancedMarker>
                </Map>
            </div>
        </APIProvider>
    )
}

export default GoogleMapBox
