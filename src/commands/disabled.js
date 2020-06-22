import { disableHistory } from '../services/reactionHistoryService'
import log                from 'winston';

exports.run = async (message) => {
    try {
        log.debug(`Heard event: disabled`)

        let author = message.author
        let guild = message.guild

        await disableHistory(author, guild)

        log.info(`User ${author.username} (${author.id}) has disabled history for guild ${guild.name} (${guild.id}).`)

    } catch (err) {
        log.error(`[/commands/disable.js] ${err}`);
    }
};