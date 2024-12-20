import Fastify from 'fastify'
import cors from '@fastify/cors'
import { db, eq, schema } from '@earthly-land/db'
import featuresRoute from './routes/features'

const fastify = Fastify({ logger: true })

fastify.register(cors, {
    origin: true,
})

fastify.register(featuresRoute, { prefix: '/api' })

const start = async () => {
    try {
        await fastify.listen({ port: 3333, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
