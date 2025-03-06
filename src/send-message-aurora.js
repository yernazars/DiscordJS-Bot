require('dotenv').config();

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const roles = [
    {
        id: '1321578229076590603',
        label: '💻 Coder'
    },
    {
        id: '1321579202142797856',
        label: '🎮 Gamer'
    },
    {
        id: '1321579592850608190',
        label: '🎙️ Musician'
    }
]

client.on('ready', async (c) => {
    try{
        const channel = await client.channels.cache.get('1321565469890838564');
        if(!channel) return;

        const embedRole = new EmbedBuilder()
        .setColor(0x00B358)
        .setTitle('Welcome To Aurora')
        .setDescription('Thanks for coming into the Aurora!')
        .addFields(
            { name: 'Information', value: 'Choose any role by pressing the buttons down below.'}
        )
        .setImage('https://i.imgur.com/HbYDxQu.jpeg');

        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Secondary)
            );
        });
        
        await channel.send({
            content: '',
            embeds: [embedRole],
            components: [row]
        });
        process.exit();
    }catch(error){
        console.log('Hasnt sent yet');
        console.log(error);
    }
});
client.login(process.env.DISCORD_BOT_ID);