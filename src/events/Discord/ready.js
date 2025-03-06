const { Translate } = require('../../process_tools');
const { ApplicationCommandOptionType, EmbedBuilder, ActivityType } = require('discord.js');

module.exports = async (client) => {
    console.log(await Translate(`Logged in <${client.user.username}>.`));

    client.user.setPresence({
        activities: [{
            name: `Watching all over you👀`,
            type: ActivityType.Custom,
        }],
        status: 'online'
    });

}