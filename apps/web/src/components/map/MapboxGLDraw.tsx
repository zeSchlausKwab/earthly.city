import { useEffect } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

interface Props extends L.ControlOptions {}

const MapboxGLDraw: React.FC<Props> = () => {
    const { current: map } = useMap()

    const handleGeometryChange = (event: any) => {
        console.log('event', event)
    }

    const draw = new MapboxDraw({
        displayControlsDefault: true,
        controls: {
            polygon: true,
            trash: true,
        },
        defaultMode: 'draw_polygon',
    })

    useEffect(() => {
        console.log('map', map)

        const innerMap = map?.getMap()

        if (innerMap) {
            innerMap.addControl(draw)

            innerMap.on('draw.create', handleGeometryChange)
            innerMap.on('draw.delete', handleGeometryChange)
            innerMap.on('draw.update', handleGeometryChange)
        }
    }, [])

    return null
}

export { MapboxGLDraw }
