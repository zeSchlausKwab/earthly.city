import ml from 'maplibre-gl'

// Base style with customizations
// const mapStyle: ml.StyleSpecification = {
//     version: 8,
//     glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
//     sources: {
//         'osm-tiles': {
//             type: 'raster',
//             tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
//             tileSize: 256,
//             attribution: '© OpenStreetMap contributors',
//         },
//     },
//     layers: [
//         {
//             id: 'osm-tiles-layer',
//             type: 'raster',
//             source: 'osm-tiles',
//             minzoom: 0,
//             maxzoom: 19,
//         },
//     ],
// }

const mapStyle = 'https://tiles.openfreemap.org/styles/positron'

export default mapStyle
