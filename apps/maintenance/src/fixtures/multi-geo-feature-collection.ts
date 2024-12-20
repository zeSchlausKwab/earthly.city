import { FeatureCollection } from '@earthly-land/common'

const longformNote = {
    title: 'A longform note about the multipolygon feature collection',
    content: 'This is a longform note about the multipolygon feature collection',
}
const multiGeoFeatureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                name: 'A multi polygon',
                description: 'A multi polygon description',
                color: '#FF0000',
            },
            geometry: {
                coordinates: [
                    [
                        [
                            [0.2910812844380075, 51.42406264207551],
                            [0.2695010907253561, 51.41836921275885],
                            [0.2691690877448423, 51.40739442098942],
                            [0.3030333917244832, 51.40563406772628],
                            [0.2910812844380075, 51.42406264207551],
                        ],
                        [
                            [0.2930733023189305, 51.42426966250457],
                            [0.3041954021557274, 51.40594472322633],
                            [0.32560959437759607, 51.41060430248294],
                            [0.3188035332841537, 51.420439632753414],
                            [0.2930733023189305, 51.42426966250457],
                        ],
                        [
                            [0.3048592671437973, 51.40517461699028],
                            [0.3225559459765748, 51.3989813928396],
                            [0.33395088063872436, 51.39941225296556],
                            [0.32635425752988567, 51.40975167843885],
                            [0.3048592671437973, 51.40517461699028],
                        ],
                    ],
                ],
                type: 'MultiPolygon',
            },
        },
        {
            type: 'Feature',
            properties: {
                name: 'A simple Polygon',
                description: 'A simple polygon description. This in NOT a multi polygon',
                color: '#0000FF',
            },
            geometry: {
                coordinates: [
                    [
                        [0.2804969169868343, 51.44822441754772],
                        [0.28359254935594436, 51.44381445619911],
                        [0.2795018922975885, 51.43623384003445],
                        [0.2811602667800912, 51.432374133936236],
                        [0.3170917139220535, 51.43113344486258],
                        [0.3111215657810078, 51.44539933508443],
                        [0.30802593341186935, 51.4496713433154],
                        [0.2984073614084366, 51.45049813745271],
                        [0.2804969169868343, 51.44822441754772],
                    ],
                ],
                type: 'Polygon',
            },
        },
    ],
}

export const multiGeoFeatureCollectionSEED = {
    note: longformNote,
    featureCollection: multiGeoFeatureCollection,
}
