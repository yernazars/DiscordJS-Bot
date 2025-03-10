const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skip',
    description:('Skip the track'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music is playing <${inter.member}><❌>`) });

        const success = queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: success ? await Translate(`Current music <${queue.currentTrack.title}> skipped <✅>`) : await Translate(`Something went wrong u know <${inter.member}><❌>`) });

        return inter.editReply({ embeds: [embed] });
    }
}