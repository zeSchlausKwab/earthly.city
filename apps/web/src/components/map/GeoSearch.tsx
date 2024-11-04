import { createControlComponent } from '@react-leaflet/core'
import { GeoSearchControl, JsonProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'

class GeoJsonProvider extends JsonProvider {
    endpoint({ query, type }) {
        return this.getUrl('https://nominatim.openstreetmap.org/search', {
            q: query,
            format: 'geojson',
            polygon_geojson: 1,
        })
    }

    parse({ data }) {
        console.log('data', data)
        return data.map((x) => ({
            x: data.x,
            y: data.y,
            label: data.label,
            bounds: data.bounds,
        }))
    }
}

const createGeoSearchInstance = () => {
    const geoJsonProvider = new GeoJsonProvider()

    const searchControl = GeoSearchControl({
        provider: geoJsonProvider,
        style: 'button',
    })
    return searchControl
}

const createPolygonSearchInstance = () => {
    const geoJsonProvider = new GeoJsonProvider()

    const searchControl = GeoSearchControl({
        provider: geoJsonProvider,
        style: 'button',
    })
    return searchControl
}

export const GeoSearchControlComponent = createControlComponent(createGeoSearchInstance)
export const PolygonSearchControlComponent = createControlComponent(createPolygonSearchInstance)
