import { html } from 'hono/html'

export const MaintenanceView = () => html`
    <!doctype html>
    <html>
        <head>
            <title>Database Maintenance</title>
            <style>
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px;
                    background-color: #4ade80;
                    color: white;
                    border-radius: 4px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }

                .notification.show {
                    opacity: 1;
                }

                button {
                    margin: 10px;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .reset {
                    background-color: #ef4444;
                    color: white;
                }

                .nuke {
                    background-color: #f97316;
                    color: white;
                }

                .seed {
                    background-color: #3b82f6;
                    color: white;
                }
            </style>
        </head>
        <body>
            <h1>Database Maintenance</h1>
            <button class="seed" onclick="callEndpoint('/seed')">Seed Database</button>
            <button class="nuke" onclick="callEndpoint('/nuke')">Nuke Database</button>
            <button class="reset" onclick="resetDatabase(this)">Reset Database</button>
            <div id="notification" class="notification"></div>

            <script>
                function showNotification(message) {
                    const notification = document.getElementById('notification')
                    notification.textContent = message
                    notification.classList.add('show')

                    setTimeout(() => {
                        notification.classList.remove('show')
                    }, 3000)
                }

                async function callEndpoint(path) {
                    try {
                        const response = await fetch(path)
                        if (!response.ok) {
                            throw new Error(\`HTTP error! status: \${response.status}\`)
                        }
                        const result = await response.text()
                        showNotification(result)
                    } catch (error) {
                        showNotification('Error: ' + error.message)
                    }
                }

                async function resetDatabase(button) {
                    try {
                        // Disable button during operation
                        button.disabled = true

                        // Nuke database
                        showNotification('Nuking database...')
                        await callEndpoint('/nuke')

                        // Wait a moment for the nuke to complete
                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        // Seed database
                        showNotification('Seeding database...')
                        await callEndpoint('/seed')

                        // Show success message
                        showNotification('Database reset completed successfully')
                    } catch (error) {
                        showNotification('Error during reset: ' + error.message)
                    } finally {
                        // Re-enable button
                        button.disabled = false
                    }
                }
            </script>
        </body>
    </html>
`
