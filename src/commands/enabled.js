import { enableHistory } from '../services/reactionHistoryService'
import log               from 'winston';

exports.run = async (message) => {
    try {
        log.debug(`Heard event: enabled`)

        let author = message.author
        let guild = message.guild

        await enableHistory(author, guild)

        log.info(`User ${author.username} (${author.id}) has enabled history for guild ${guild.name} (${guild.id}).`)

    } catch (err) {
        log.error(`[/commands/enable.js] ${err}`);
    }
};