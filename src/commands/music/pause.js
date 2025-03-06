const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'pause',
    description:('Pause the track'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music is playing <${inter.member}><❌>`) });

        if (queue.node.isPaused()) return inter.editReply({ content: await Translate(`The track is currently paused, <${inter.member}><❌>`) });

        const success = queue.node.setPaused(true);
        const pauseEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`Current music <${queue.currentTrack.title}> paused <✅>`) : await Translate(`Something went wrong <${inter.member}><❌>`) })
            .setColor('#2f3136')

        return inter.editReply({ embeds: [pauseEmbed] });
    }
}