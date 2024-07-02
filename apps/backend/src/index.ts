import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db, eq, schema } from '@earthly-land/db';

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: true,
});

// Prefix all routes with '/api'
fastify.register(async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });

  fastify.get('/features', async (request, reply) => {
    const features = await db.select().from(schema.features).execute();
    return features;
  });

  fastify.put<{ Params: { id: string }, Body: { kind: number; pubkey: string; content: any; tags: any[] } }>('/features/:id', async (request, reply) => {
    const { id } = request.params;
    const { kind, pubkey, content, tags } = request.body;
    const updatedFeature = await db.update(schema.features)
      .set({ kind, pubkey, content, tags })
      .where(eq(schema.features.id, parseInt(id)))
      .returning()
      .execute();
    return updatedFeature[0];
  });

  fastify.post<{ Body: { kind: number; pubkey: string; content: any; tags: any[] } }>('/features', async (request, reply) => {
    const { kind, pubkey, content, tags } = request.body;
    const newFeature = await db.insert(schema.features).values({
      kind,
      pubkey,
      content,
      tags,
    }).returning().execute();
    return newFeature[0];
  });
}, { prefix: '/api' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();