import { FastifyPluginAsync } from 'fastify';
import { db, schema } from '@earthly-land/db';
import { eq } from 'drizzle-orm';

const featuresRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/features', async (request, reply) => {
    const features = await db.select().from(schema.features).execute();
    return features;
  });

  fastify.post<{ Body: { kind: number; pubkey: string; content: any; tags: any[] } }>(
    '/features',
    async (request, reply) => {
      const { kind, pubkey, content, tags } = request.body;
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
