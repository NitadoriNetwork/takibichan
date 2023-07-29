const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const request = require("request");
const { Client, GatewayIntentBits, Collection, Events, IntentsBitField, Partials } = require('discord.js');

dotenv.config({ path: './.env' });

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });


client.once(Events.ClientReady, () => {
	console.log('Ready!!'); // 起動時に"Ready!!"とコンソールに出力する
});

//ログイン
client.login(process.env.TOKEN); 