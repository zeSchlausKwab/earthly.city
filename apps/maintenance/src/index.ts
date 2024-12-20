import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { deleteAllFromRelay } from './actions/nuke.js'
import { seedFeatures } from './actions/seed.js'
import { MaintenanceView } from './components/MaintenanceView.js'

const app = new Hono()

app.get('/', (c) => {
    return c.html(MaintenanceView())
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
    port,
})
