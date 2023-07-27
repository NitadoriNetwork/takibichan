const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const request = require("request");
const { Client, GatewayIntentBits, Collection, Events, IntentsBitField, Partials } = require('discord.js');

dotenv.config({ path: './.env' });

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
        client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log('Ready!!'); // 起動時に"Ready!!"とコンソールに出力する
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.followUp({ content: 'エラーが起きてしまいました...', ephemeral: true});
    }
});

//問い合わせ時に運営にメンションを飛ばす機能
client.on(Events.ThreadCreate, (thread) => {
    if ( process.env.SUPCHID !== thread.parentId) return;
    client.channels.cache.get(`${thread.id}`).send("<@&1052524925660975154>\n問い合わせを受け付けました。対応までもうしばらくお待ちください。");
})

client.on('messageCreate', message => {
    if (message.guildId !== null) return;
    if (message.author.bot !== false) return;
    client.channels.cache.get(`${process.env.OBCHID}`).send({
        embeds: [{
            color: 0xF00035,
            timestamp: new Date(),
            footer: {
                text: "焚き火ちゃん",
            },
            title: `意見が届きました！`,
            description: message.content
        }]});
    message.reply(`ご意見を送信しました！`);
})

//ログイン
client.login(process.env.TOKEN); 