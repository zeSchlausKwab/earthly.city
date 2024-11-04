import { z } from 'zod'

export const LongformNoteSchema = z.object({
    kind: z.literal(30023),
    pubkey: z.string(),
    created_at: z.number(),
    content: z.string(),
    tags: z.array(z.array(z.string())),
})

export type LongformNote = z.infer<typeof LongformNoteSchema>

export const GeoJsonFeatureSchema = z.object({
    type: z.literal('Feature'),
    geometry: z.object({
        type: z.enum(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']),
        coordinates: z
            .array(z.number())
            .or(z.array(z.array(z.number())))
            .or(z.array(z.array(z.array(z.number())))),
    }),
    properties: z.record(z.any()).optional(),
})

export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>

export const FeatureCollectionSchema = z.object({
    type: z.literal('FeatureCollection'),
    features: z.array(GeoJsonFeatureSchema),
})

export type FeatureCollection = z.infer<typeof FeatureCollectionSchema>

export const Feature37515Schema = z.object({
    kind: z.literal(37515),
    pubkey: z.string(),
    created_at: z.number(),
    content: FeatureCollectionSchema,
    tags: z.array(z.array(z.string())),
})

export type Feature37515 = z.infer<typeof Feature37515Schema>
