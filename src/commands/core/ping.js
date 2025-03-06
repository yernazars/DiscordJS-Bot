const ms = require('ms');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'ping',
    description:("Ping of the bot"),

    async execute({ inter, client }) {
        await inter.editReply("Ping?");
        inter.editReply(await Translate(`Pong! API Latency is <${Math.round(client.ws.ping)}ms 🛰️>, last heartbeat calculated <${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })}> ago`));
    }
};