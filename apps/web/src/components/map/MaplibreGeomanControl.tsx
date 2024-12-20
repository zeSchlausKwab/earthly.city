import { Geoman, GmOptionsPartial } from '@geoman-io/maplibre-geoman-free'
import { useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'

import 'maplibre-gl/dist/maplibre-gl.css'
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css'

interface Props extends L.ControlOptions {
    position: L.ControlPosition
    enabled?: boolean
    drawCircle?: boolean
    oneBlock?: boolean
}

const MaplibreGeomanControl: React.FC<Props> = ({ position, enabled = false, drawCircle = false, oneBlock = false }) => {
    const { current: map } = useMap()

    useEffect(() => {
        console.log('map', map)
        if (map) {
            const gmOptions: GmOptionsPartial = {
                map,
            }

            const geomanControl = new Geoman(map.getMap(), gmOptions)
        }
    }, [map, position, drawCircle, oneBlock, enabled])

    return null
}

export { MaplibreGeomanControl }
