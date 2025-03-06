const { QueueRepeatMode, useQueue } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'loop',
    description:('Queue or song loop'),
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description:('Loop actions to choose'),
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Queue', value: 'enable_loop_queue' },
                { name: 'Disable', value: 'disable_loop' },
                { name: 'Song', value: 'enable_loop_song' },
                { name: 'Autoplay', value: 'enable_autoplay' },
            ],
        }
    ],

   async execute({ inter }) {
        const queue = useQueue(inter.guild);
        const errorMessage = await Translate(`Something went wrong <${inter.member}><❌>`);
        let baseEmbed = new EmbedBuilder()
            .setColor('#2f3136');

        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music is playing <${inter.member}><❌>`) });

        switch (inter.options._hoistedOptions.map(x => x.value).toString()) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === QueueRepeatMode.TRACK) return inter.editReply({ content: `You must first disable the current music in the loop mode (\`/loop Disable\`) ${inter.member}<❌>` });

                const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Queue in on repeat mode<🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'disable_loop': {
                if (queue.repeatMode === QueueRepeatMode.OFF) return inter.editReply({ content: await Translate(`You must first enable the loop mode <(/loop Queue or /loop Song)> <${inter.member}><❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.OFF);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Queue is no longer on repeat mode<🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_loop_song': {
                if (queue.repeatMode === QueueRepeatMode.QUEUE) return inter.editReply({ content: await Translate(`You must first disable the current music in the loop mode <(\`/loop Disable\`)> <${inter.member}><❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Repeat mode enabled the current song will be repeated endlessly (you can end the loop with <\`/loop disable\` >)`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_autoplay': {
                if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) return inter.editReply({ content: await Translate(`You must first disable the current music in the loop mode <(\`/loop Disable\`)> <${inter.member}><❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`Autoplay for queue enabled<🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
        }
    }
}