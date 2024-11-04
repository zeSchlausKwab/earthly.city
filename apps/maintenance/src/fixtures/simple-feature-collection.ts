import type { FeatureCollection } from "@earthly-land/common";

const longformNote = {
    title: 'A longform note about the feature collection',
    content: 'This is a longform note about the feature collection',
}
export const basicFeatureCollection: FeatureCollection = 
    {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              0.04861073921088632,
              51.25704967221071
            ],
            [
              -0.03608406797815178,
              51.2588617506963
            ],
            [
              -0.12295053688967528,
              51.18904515829851
            ],
            [
              -0.022330210400241413,
              51.15182687466569
            ],
            [
              0.0782901160892493,
              51.176793674439864
            ],
            [
              0.08552898849848134,
              51.221699863882094
            ],
            [
              0.04861073921088632,
              51.25704967221071
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              0.053218049989624205,
              51.260003086388
            ],
            [
              0.09375573548180682,
              51.22102862403506
            ],
            [
              0.08434520135006096,
              51.17294489148344
            ],
            [
              0.1545622637206634,
              51.174760283134304
            ],
            [
              0.2001671615493592,
              51.204250380383485
            ],
            [
              0.23780929807762163,
              51.25411371597002
            ],
            [
              0.19003274017620697,
              51.31071102854659
            ],
            [
              0.07421078162673211,
              51.30618580981144
            ],
            [
              0.053218049989624205,
              51.260003086388
            ]
          ]
        ],
        "type": "Polygon"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          0.07783021783134814,
          51.36995018764276
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          -0.07852942621033776,
          51.33559175552631
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          -0.1436792778942788,
          51.27947793527224
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            0.11330069263800624,
            51.42279373321881
          ],
          [
            0.1574578143348333,
            51.382602062810065
          ],
          [
            0.12850232469688194,
            51.34960949065544
          ],
          [
            0.014852027869949325,
            51.34825312301305
          ],
          [
            -0.01699901073101273,
            51.3658827708596
          ],
          [
            -0.1118282392933736,
            51.367238616597234
          ],
          [
            -0.12196266066669637,
            51.32609343448755
          ]
        ],
        "type": "LineString"
      }
    }
  ]
}
  
export const simpleFeatureSEED = {
    note: longformNote,
    featureCollection: basicFeatureCollection,
}