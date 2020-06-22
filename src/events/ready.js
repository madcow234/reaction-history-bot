import { setupRolesForGuild } from '../services/roleService'
import { mainContext, enums } from '../application'
import log                    from 'winston'

/**
 * Sets the bot's activity message after logging in.
 *
 * @returns {Promise<void>} an empty Promise
 */
exports.run = async () => {
    try {
        log.debug(`Heard event: ready`)
        log.info(`${mainContext.client.user.username} has come online.`)

        await mainContext.client.user.setActivity(`${process.env.PREFIX} on/off`, {type: "LISTENING"})

        log.debug(`Preparing roles for all guilds.`)
        for (let guild of mainContext.client.guilds.cache.array()) {
            await setupRolesForGuild(guild)
        }
        log.info(`Successfully prepared the following roles for all guilds: ${enums.roles}.`)

        let numChannels = mainContext.client.channels.cache.size
        let numGuilds = mainContext.client.guilds.cache.size
        let numUsers = mainContext.client.users.cache.size

        log.info(`Ready to serve in ${numChannels} channel${numChannels === 1 ? '' : 's'} on ${numGuilds} server${numGuilds === 1 ? '' : 's'}, for a total of ${numUsers} user${numUsers === 1 ? '' : 's'}.`)

    } catch (err) {
        log.error(`[/events/ready#run] ${err}`)
    }
}