const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'clear',
    description:('Clear all music'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music is playing <${inter.member}><❌>`) });

        if (!queue.tracks.toArray()[1]) return inter.editReply({ content: await Translate(`No music after this one <${inter.member}><❌>`) });

        queue.tracks.clear();

        const clearEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`The queue has been cleared <🗑️>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [clearEmbed] });
    }
}