import { readdirSync } from 'fs'
import { mainContext } from '../application'
import log             from 'winston'

/**
 * Reads the events directory and creates an event listener for each of the files.
 *
 * @returns {Promise<void>} an empty Promise
 */
exports.loadEvents = async () => {
    try {
        log.debug('Searching for event definition files.')

        // Read the files in this directory
        let eventFiles = await readdirSync(__dirname)

        // Remove this file from the eventFiles list
        eventFiles.splice(eventFiles.indexOf('index.js'), 1)

        // Log a warning if the directory is empty or the index.js file is the only one in the directory
        if (eventFiles.length === 0) {
            log.warn(`Events were not loaded. Reason: 'No events have been defined in the /events/ directory.'`)
            return
        }

        log.info(`Found ${eventFiles.length} event definition file${eventFiles.length === 1 ? '' : 's'}: [${eventFiles.join(', ')}].`)

        log.debug('Registering event definitions with Discord.')
        for (let file of eventFiles) {
            let eventFilename = require(`./${file}`)
            let eventName = file.split(".")[0]

            // Creates the event listener as an async function that awaits the return of the run function in each event file
            mainContext.client.on(eventName, async (...args) => await eventFilename.run(...args))
        }

        log.info('Successfully registered event definitions with Discord.')

    } catch (err) {
        log.error(`[/events/index#loadEvents] Events were not loaded. Reason: '${err}'`)
    }
}
