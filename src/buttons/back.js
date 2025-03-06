const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(`No music currently playing<❌>`),
    });
  if (!queue.history.previousTrack)
    return inter.editReply({
      content: await Translate(`There was no music played before <${inter.member}><❌>`),
    });

  await queue.history.back();

  inter.editReply({
    content: await Translate(`Playing the <**previous**> track <✅>`),
  });
};