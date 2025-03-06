const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue) => {
    if(!client.config.app.extraMessages) return;

    (async () => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Songs in playlist added to Queue <✅>`) })
            .setColor('#2f3136');

            queue.metadata.channel.send({ embeds: [embed] });
    })()
}