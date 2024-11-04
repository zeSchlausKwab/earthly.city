import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { deleteAllFromRelay } from './actions/nuke.js'
import { seedFeatures } from './actions/seed.js'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Database Maintenance</title>
      </head>
      <body>
        <h1>Database Maintenance</h1>
        <button onclick="callEndpoint('/seed')">Seed Database</button>
        <button onclick="callEndpoint('/nuke')">Nuke Database</button>

        <script>
          async function callEndpoint(path) {
            try {
              const response = await fetch(path);
              const result = await response.text();
              alert(result);
            } catch (error) {
              alert('Error: ' + error.message);
            }
          }
        </script>
      </body>
    </html>
  `)
})

app.get('/seed', async (c) => {
  try {
    await seedFeatures()
    return c.text('Database seeded successfully')
  } catch (error) {
    return c.text('Failed to seed database: ' + error.message, 500)
  }
})

// Nuke endpoint
app.get('/nuke', async (c) => {
  try {
    await deleteAllFromRelay()
    return c.text('Database nuked successfully')
  } catch (error) {
    return c.text('Failed to nuke database: ' + error.message, 500)
  }
})

const port = 3335
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
