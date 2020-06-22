import { enums } from '../application'
import log             from 'winston'

exports.setupRolesForGuild = async (guild) => {
    try {
        for (let [key, value] of Object.entries(enums.roles)) {
            await module.exports.createRoleIfNotExists(guild, value, key)
        }

    } catch (err) {
        log.error(`[/services/roleService#setupRolesForGuild] ${err}`)
    }
}

exports.createRoleIfNotExists = async (guild, roleName, roleEnum) => {
    try {
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            log.debug(`Creating '${roleName}' (${roleEnum}) role for guild '${guild.name}' (${guild.id}).`)
            role = await guild.roles.create( { data: { name: roleName } } )
            log.info(`Successfully created '${roleName}' (${roleEnum}) role for guild '${guild.name}' (${guild.id}).`)

        } else {
            log.debug(`Guild '${guild.name}' (${guild.id}) already contains '${roleName}' (${roleEnum}) role...no need to create.`)
        }

        return role

    } catch (err) {
        log.error(`[/services/roleService#createRoleIfNotExists] ${err}`)
    }
}

exports.userHasRoleForGuild = async (user, roleName, guild) => {
    try {
        log.debug(`Checking if user '${user.username}' (${user.id}) has the '${roleName}' role for guild '${guild.name}' (${guild.id}).`)

        let guildMember = await guild.members.fetch(user)
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            log.warn(`The '${role.name}' role does not exist for guild '${guild.name}' (${guild.id}).`)
            return false
        }

        if (role && guildMember.roles.cache.has(role.id)) {
            await guildMember.roles.add(role)
            log.info(`Yes, user '${user.username}' (${user.id}) has the '${role.name}' role for guild '${guild.name}' (${guild.id}).`)
            return true

        } else {
            log.info(`No, user '${user.username}' (${user.id}) does not have the '${role.name}' role for guild '${guild.name}' (${guild.id}).`)
            return false
        }

    } catch (err) {
        log.error(`[/services/roleService#userHasRoleForGuild] ${err}`)
    }
}

exports.assignRole = async (guild, user, roleName) => {
    try {
        let guildMember = await guild.members.fetch(user)
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            log.warn(`The '${role.name}' role does not exist for guild '${guild.name}' (${guild.id}).`)
            return
        }

        if (!guildMember.roles.cache.has(role.id)) {
            log.debug(`Assigning '${role.name}' role to user '${user.username}' (${user.id}) for guild '${guild.name}' (${guild.id}).`)
            await guildMember.roles.add(role)
            log.info(`Successfully assigned '${role.name}' role to user '${user.username}' (${user.id}) for guild '${guild.name}' (${guild.id}).`)

        } else {
            log.debug(`User '${user.username}' (${user.id}) already has '${role.name}' role for guild '${guild.name}' (${guild.id})...no need to assign.`)
        }
        return true

    } catch (err) {
        log.error(`[/services/roleService#assignRole] ${err}`)
        return false
    }
}

exports.removeRole = async (guild, user, roleName) => {
    try {
        let guildMember = await guild.members.fetch(user)
        let role = guild.roles.cache.find(role => role.name === roleName)

        if (!role) {
            log.warn(`The '${role.name}' role does not exist for guild '${guild.name}' (${guild.id}).`)
            return
        }

        if (guildMember.roles.cache.has(role.id)) {
            log.debug(`Removing '${role.name}' role from user '${user.username}' (${user.id}) for guild '${guild.name}' (${guild.id}).`)
            await guildMember.roles.remove(role)
            log.info(`Successfully removed '${role.name}' role from user '${user.username}' (${user.id}) for guild '${guild.name}' (${guild.id}).`)

        } else {
            log.debug(`User '${user.username}' (${user.id}) does not have '${role.name}' role for guild '${guild.name}' (${guild.id})...no need to remove.`)
        }
        return true

    } catch (err) {
        log.error(`[/services/roleService#removeRole] ${err}`)
        return false
    }
}