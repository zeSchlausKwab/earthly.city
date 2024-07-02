import { z } from 'zod';

export const Feature37515Schema = z.object({
    kind: z.literal(37515),
    pubkey: z.string(),
    created_at: z.number(),
    content: z.object({
        type: z.literal('Feature'),
        geometry: z.object({
            type: z.enum(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']),
            coordinates: z.array(z.number()).or(z.array(z.array(z.number()))).or(z.array(z.array(z.array(z.number())))),
        }),
        properties: z.record(z.any()).optional(),
    }),
    tags: z.array(z.array(z.string())),
});

export type Feature37515 = z.infer<typeof Feature37515Schema>;