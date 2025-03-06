const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'syncedlyrics',
    description:('Lyrics sync'),
    voiceChannel: true,

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing <${inter.member}><❌>`) });

        const metadataThread = queue.metadata.lyricsThread;
        if (metadataThread && !metadataThread.archived) return inter.editReply({ content: await Translate(`Thread already created <${inter.member}> ! <${queue.metadata.lyricsThread}>`) });

        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e);
                return inter.editReply({ content: await Translate(`Error blya<❌>`) });
            });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`No lyrics found for <${queue.currentTrack.title}><❌>`) });
        
        const thread = await queue.metadata.channel.threads.create({
            name: `Lyrics of ${queue.currentTrack.title}`
        });

        queue.setMetadata({
            channel: queue.metadata.channel,
            lyricsThread: thread
        });

        const syncedLyrics = queue?.syncedLyrics(lyrics);
        syncedLyrics.onChange(async (lyrics) => {
            await thread.send({
                content: lyrics
            });
        });

        syncedLyrics?.subscribe();

        return inter.editReply({ content: await Translate(`Lyrics is synced <${thread}> ! <${inter.member}> <✅>`) });
    }
}