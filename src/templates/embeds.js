import { MessageEmbed } from 'discord.js'
import { enums } from '../application'

exports.newErrorEmbed = (errorDescription) => {
    return new MessageEmbed()
        .setDescription(errorDescription)
        .setThumbnail(enums.embeds.images.errorThumbnailUrl)
        .setColor('RED')
        .setTimestamp()
};

exports.newSetReactionHistoryEmbed = (guild, enabled = false) => {
    let guildLink = `https://discordapp.com/channels/${guild.id}`
    return new MessageEmbed()
        .setColor(enabled ? 'GREEN' : 'RED')
        .setDescription(`Reaction History has been ${enabled ? 'enabled' : 'disabled'} for guild [${guild.name}](${guildLink}).`)
        .setTimestamp()
}

exports.newReactionHistoryEmbed = (reactionInstance, user, added = false) => {
    let guildLink = `https://discordapp.com/channels/${reactionInstance.message.guild.id}`
    let channelLink = `${guildLink}/${reactionInstance.message.channel.id}`
    let messageLink = `${channelLink}/${reactionInstance.message.id}`

    let reaction = `\u200B ${reactionInstance.emoji}`
    let reactedMessage = `${reactionInstance.message.content ? `> ${reactionInstance.message}` : ``}`
    let addedDescriptionMessage = `<@!${user.id}> reacted with ${reaction}\n\n to your message:`
    let removedDescriptionMessage = `<@!${user.id}> removed ${reaction}\n\n from your message:`
    let guildLinkMessage = `Server: [${reactionInstance.message.guild.name}](${guildLink})`
    let channelLinkMessage = `Channel: [${reactionInstance.message.channel.name}](${channelLink})`
    let messageLinkMessage = `Message: [link](${messageLink})`

    let embed = new MessageEmbed()
        .setColor(added ? 'DARK_GREEN' : 'DARK_RED')
        .setDescription(`${added ? addedDescriptionMessage : removedDescriptionMessage}\n\n${reactedMessage}\n\n${guildLinkMessage} / ${channelLinkMessage} / ${messageLinkMessage}`)
        .setTimestamp()

    if (reactionInstance.emoji.url) {
        embed.setThumbnail(reactionInstance.emoji.url)
    }

    return embed
};