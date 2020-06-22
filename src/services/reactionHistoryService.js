import { newErrorEmbed,
         newSetReactionHistoryEmbed } from '../templates/embeds'
import { assignRole, removeRole }     from './roleService'
import { enums }                      from '../application'
import log                            from 'winston'

exports.enableHistory = async (user, guild) => {
    try {
        log.debug(`User '${user.username}' (${user.id}) has enabled reaction history for guild '${guild.name}' (${guild.id}).`)
        let success = await assignRole(guild, user, enums.roles.historyEnabled)

        if (success) {
            await user.send(newSetReactionHistoryEmbed(guild, true))

        } else {
            let errorDescription = `An error occurred that prevented me from enabling reaction history for ${guild.name}! Contact a server administrator for help.`
            await user.send(newErrorEmbed(errorDescription))
        }

    } catch (err) {
        log.error(`[/services/reactionHistoryService#enableHistory] ${err}`)
    }
}

exports.disableHistory = async (user, guild) => {
    try {
        log.debug(`User '${user.username}' (${user.id}) has disabled notifications for guild '${guild.name}' (${guild.id}).`)
        let success = await removeRole(guild, user, enums.roles.historyEnabled)

        if (success) {
            await user.send(newSetReactionHistoryEmbed(guild))

        } else {
            let errorDescription = `An error occurred that prevented me from disabling reaction notifications for ${guild.name}! Contact a server administrator for help.`
            await user.send(newErrorEmbed(errorDescription))
        }

    } catch (err) {
        log.error(`[/services/reactionHistoryService#disableHistory] ${err}`)
    }
}