const { Translate } = require('../process_tools');

const maxVol = client.config.opt.maxVol;

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music is playing<❌>`) });

    const vol = Math.floor(queue.node.volume + 5)
    if (vol > maxVol) return inter.editReply({ content: await Translate(`I can not move the volume up any more <${inter.member}><❌>`) });
    if (queue.node.volume === vol) return inter.editReply({ content: await Translate(`The volume you want to change is already the current one <${inter.member}><❌>`) });

    const success = queue.node.setVolume(vol);

    return inter.editReply({ content: success ? await Translate(`The volume has been modified to <${vol}/${maxVol}% 🔊>`) : await Translate(`Error blya <${inter.member}><❌>`) });
}