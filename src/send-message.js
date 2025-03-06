require('dotenv').config();

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const roles = [
    {
        id: '1162511902589595758',
        label: '🧙🏼‍♀️Чародейка'
    },
    {
        id: '1162511492525068428',
        label: '🧙🏽‍♂️Странник'
    }
]

client.on('ready', async (c) => {
    try{
        const channel = await client.channels.cache.get('1087637681598636087');
        if(!channel) return;

        const embedRole = new EmbedBuilder()
        .setColor(0x00B358)
        .setTitle('Welcome To Iredale!')
        .setDescription('Спасибо, что заглянули в наш Айрдейл!\nThanks for coming into the Iredale!')
        .addFields(
            { name: 'Информация', value: 'Для того, чтобы выбрать желаемую роль, нажмите на соответствующую кнопку ниже.'},
            { name: 'Information', value: 'Choose any role by pressing the buttons down below.'}
        )
        .setImage('https://i.imgur.com/bEWp9iJ.png');

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