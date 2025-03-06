const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'resume',
    description:('Play the track'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}><❌>`) });

        if (queue.node.isPlaying()) return inter.editReply({ content: await Translate(`The track is already running, <${inter.member}><❌>`) })

        const success = queue.node.resume();

        const resumeEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`Current music <${queue.currentTrack.title}> resumed <✅>`) : await Translate(`Error blya <${inter.member}><❌>`) })
            .setColor('#2f3136')

        return inter.editReply({ embeds: [resumeEmbed] });
    }
}