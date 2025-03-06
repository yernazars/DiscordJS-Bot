const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async(client, inter) => {
    await inter.deferReply({ ephemeral: true });
    
    if(inter.type === InteractionType.ApplicationCommand){
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        if(!command){
            errorEmbed.setDescription(await Translate(`Unexpected error`));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if(command.permissions && !inter.member.permissions.has(command.permissions)){
            errorEmbed.setDescription(await Translate(`No permission, you are nobody`));
            return inter.editReply({ embeds: [errorEmbed] , ephemeral: true });
        }

        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName).id)) {
            errorEmbed.setDescription(await Translate(`Command is reserved for members with <\`${DJ.roleName}\`> `));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                errorEmbed.setDescription(await Translate(`Gotta be in a voice chat`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                errorEmbed.setDescription(await Translate(`Not in the same voice channel`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        command.execute({ inter, client });
    }else if (inter.type === InteractionType.MessageComponent) {
        const customId = inter.customId;

        /* INTERACTION ROLE ERROR */
        if(inter.guild.roles.cache.get(customId)){
            let message;
            const role = inter.guild.roles.cache.get(customId);
            const hasRole = inter.member.roles.cache.has(role.id);
            if(hasRole){
                await inter.member.roles.remove(role);
                message = await Translate(`Role has been removed`);
                return inter.editReply({ content: message });
            }
            await inter.member.roles.add(role);
            message = await Translate(`Role has been assigned`);
            return inter.editReply({ content: message });
        }

        if (!customId) return;

        const queue = useQueue(inter.guild);
        const path = `../../buttons/${customId}.js`;

        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
}