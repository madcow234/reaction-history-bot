import { newErrorEmbed } from '../templates/embeds'
import { getCommands }   from '../commands'
import { mainContext }   from '../application'
import log               from 'winston'

/**
 * Listens to all messages and filters which ones should be sent to the command monitor.
 *
 * @param message the Discord message
 * @returns {Promise<void>} an empty Promise
 */
exports.run = async (message) => {
    try {
        // If the message is a partial (only the ID), fetch the full message from Discord
        if (message.partial) await message.fetch()

        // Don't respond to bots...unless I'm the one talking
        if (message.author.bot && message.author.id !== mainContext.client.user.id) return

        // Don't respond if the message doesn't start with the prefix
        if (!message.content.toLowerCase().startsWith(process.env.PREFIX.toLowerCase())) return

        // Now we know the message is probably meant for us, so tokenize it into an array of arguments
        let args = message.content.trim().split(/ +/g)

        // Ensure that the first argument is exactly the prefix and not just startsWith
        // We do this because it is cheaper to check startsWith on every message
        // This allows us to have both !ics and !ics-test prefixes on separate bots
        // Additionally, this reduces the possible namespace collisions on the prefix
        if (args[0].toLowerCase() !== process.env.PREFIX.toLowerCase()) return

        // Delete the command message
        await message.delete()

        // Remove the command prefix from the args list
        args.splice(0, 1)

        // If the command does not contain any arguments, send an error message and return
        if (args.length === 0) {
            // TODO make this a help embed
            await message.author.send(newErrorEmbed(`**Hi ${message.author.username}!\n\nI'm doing well, but I can't help you if you don't issue a command.**`))
            return
        }

        // Read the /commands/ folder and create a list of available commands to verify user-issued commands against
        // This is very important because the required commandFile below relies on user input to call a file, which can be very dangerous
        // We need to ensure that ONLY commands already available in the /commands/ folder actually load a file
        let availableCommands = await getCommands()

        // Log a warning if there are no files in the directory
        if (availableCommands.length === 0) {
            await message.author.send(newErrorEmbed(`**I'm sorry, an unexpected error has occurred. Please try again later.**`))
            return
        }

        // Exit and notify the user if they attempted to issue a command that is not available in the /commands/ folder
        if (availableCommands.lastIndexOf(args[0].toLowerCase()) === -1) {
            await message.author.send(newErrorEmbed(`**I'm sorry <@!${message.author.id}>, \`${args[0]}\` is not a valid command.**`))
            return
        }

        // Execute the proper command file, passing in the remaining arguments (does not include the prefix or the command)
        let commandFile = require(`../commands/${args[0].toLowerCase()}.js`)
        await commandFile.run(message, args.slice(1))

    } catch (err) {
        log.error(`[/events/message#run] ${err}`)
    }
}