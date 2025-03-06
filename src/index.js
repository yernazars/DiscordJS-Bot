require('dotenv').config();

const { Player } = require('discord-player');
const { Client, GatewayIntentBits, Attachment, AttachmentBuilder } = require('discord.js');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Replicate = require("replicate");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
    userAgent: 'https://www.npmjs.com/package/create-replicate'
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelGemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

global.client = new Client({ 
    intents: [
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildPresences, 
        GatewayIntentBits.GuildMembers] });

/* MUSIC BOT */
client.config = require('./config');

const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.register(YoutubeiExtractor, {});

console.clear();
require('./loader');
/* --------------- */

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;

    const targetChannelID = '1322518304040026154';
    if(message.channel.id !== targetChannelID) return;

    const userInput = message.content.trim();
    const model =
        'black-forest-labs/flux-schnell';
    const input = {
        prompt: userInput,
    };
    if(userInput.toLowerCase().includes('!generate')){
        try{
            await message.channel.send("Generating, please wait... <💕>");
            const output = await replicate.run(model, { input });

            const response = await fetch(output[0]);
            const buffer = await response.arrayBuffer();
            const file = new AttachmentBuilder(Buffer.from(buffer), {
                name: 'flux.png'
            });
            await message.channel.send({
                content: `"${userInput}"`,
                files: [file]
            })
        }catch(err){
            console.error("Replicate error:", err);
            await message.channel.send("Error generating the image");
        }
    }else{
        try{
            if(userInput.toLowerCase().includes('!ask')){
                const result = await modelGemini.generateContent(userInput);
                const response = await result.response;
                const text = response.text();
        
                const chunkSize = 2000;
                for(let i = 0; i < text.length; i += chunkSize){
                    const chunk = text.slice(i, i + chunkSize);
                    await message.channel.send(chunk);
                }
            }
        }catch(err){
            console.log("Catched nullptr? ohh there is no nullptr, then...: ", err);
            message.channel.send("Catched nullptr? Oh, but there is no nullptr...");
        }
    }
});

client.login(process.env.DISCORD_BOT_ID);