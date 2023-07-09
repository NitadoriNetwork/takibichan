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

//スパム自動削除

client.on('messageCreate', async message => {
	try {
        if (message.author.bot) return;
        let urls = String(message.content).match(/https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g);
        if (urls) {
            let safeResult = await getSafe(urls);
            if (safeResult.matches) {
                message.delete();
            }
        }
	} catch (error) {
		console.error(error);
	}
});

function getSafe(urls) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GSBKEY}`,
            json:  {
                "client": {
                    "clientId":      `${process.env.CLIENTID}`,
                    "clientVersion": "1.5.2"
                },
                "threatInfo": {
                    "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
                    "platformTypes":    ["WINDOWS"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": urls.map(f => {
                        return { "url": f }
                    })
                }
            },
            method: "POST"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

//カスタムステータス

client.on('ready', () => {
    setInterval(() => {
        client.user.setActivity({
            name: `${client.ws.ping}ms|焚き火鯖`
        })
    }, 5000)
})


// 入室時ロール自動付与

client.on("guildMemberAdd", member => {
    member.roles.add(`${process.env.GSTROLEID}`);
});

// お気持ちチャンネルでのメッセージ自動削除
client.on('ready', () => {
    setInterval(async () => {
            let now = new Date;
            let h = now.getHours();
            let m = now.getMinutes();
            if (h === 4 && m === 0) {
                const channel = client.channels.cache.get(`${process.env.MDCHID}`);
                channel.messages.fetch({ limit: 100 })
                    .then(messages => {
                        channel.bulkDelete(messages);
                    })
                    .catch(console.error);
            } else {
                return;
            };
    },100);
})

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