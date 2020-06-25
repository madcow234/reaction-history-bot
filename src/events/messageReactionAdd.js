import { newReactionHistoryEmbed } from '../templates/embeds'
import { userHasRoleForGuild }     from '../services/roleService'
import {enums, mainContext} from '../application'
import log                         from 'winston'

/**
 * Sends a Reaction History embed to the author of a message, when a reaction is added, if the user has reaction history enabled.
 *
 * @returns {Promise<void>} an empty Promise
 */
exports.run = async (reaction, user) => {
    try {
        let reactionInstance = (reaction.partial) ? await reaction.fetch() : reaction

        // Don't respond to bots...unless I'm the one talking
        if (reaction.message.author.bot && reaction.message.author.id !== mainContext.client.user.id) return

        if (await userHasRoleForGuild(reactionInstance.message.author, enums.roles.historyEnabled, reactionInstance.message.guild)) {
            await reactionInstance.message.author.send(newReactionHistoryEmbed(reactionInstance, user, true))
        }

    } catch (err) {
        log.error(`[/events/messageReactionAdd#run] ${err}`)
    }
}