import { FastifyPluginAsync } from 'fastify';
import { db, schema } from '@earthly-land/db';
import { Feature37515Schema } from '@earthly-land/common';
import { eq } from 'drizzle-orm';

const featuresRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/features', async (request, reply) => {
    const features = await db.select().from(schema.features).execute();
    return features;
  });

  fastify.put<{
    Params: { id: string };
    Body: { kind: number; pubkey: string; content: any; tags: any[] };
  }>('/features/:id', async (request, reply) => {
    const { id } = request.params;
    const { kind, pubkey, content, tags } = request.body;
    const updatedFeature = await db
      .update(schema.features)
      .set({ kind, pubkey, content, tags })
      .where(eq(schema.features.id, parseInt(id)))
      .returning()
      .execute();
    return updatedFeature[0];
  });

  fastify.post<{ Body: { kind: number; pubkey: string; content: any; tags: any[] } }>(
    '/features',
    async (request, reply) => {
      const { kind, pubkey, content, tags } = request.body;

      console.log('Validating feature');

      const validationResult = Feature37515Schema.safeParse(request.body);
      if (validationResult.success) {
        console.log('Feature is valid');
      } else {
        console.error('Feature validation failed:', validationResult.error);
      }

      const newFeature = await db
        .insert(schema.features)
        .values({
          kind,
          pubkey,
          content,
          tags,
        })
        .returning()
        .execute();
      return newFeature[0];
    }
  );
};

export default featuresRoute;
