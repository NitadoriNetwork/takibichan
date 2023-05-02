const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const request = require("request");
const { Client, GatewayIntentBits, Collection, Events, IntentsBitField } = require('discord.js');

dotenv.config({ path: './.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

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

//入退室通知

client.on("guildMemberAdd", member => {
    client.channels.cache.get(process.env.JRNSENDCH).send(`${member.user.tag}さん！\nいらっしゃいませ〜！！`);
});

client.on("guildMemberRemove", member => {
    client.channels.cache.get(process.env.JRNSENDCH).send(`${member.user.tag}さん、ありがとうございました！`);
});

// 入室時ロール自動付与

client.on("guildMemberAdd", member => {
    member.roles.add(`${process.env.GSTROLEID}`);
});

//通話通知

var start_buf=Date.now();
var end_buf=Date.now();

client.on('voiceStateUpdate', (oldGuildMember, newGuildMember) =>{
// 開始時の動作
    if(newGuildMember.channelId != process.env.NOCNSENDID1 && newGuildMember.channelId != process.env.NOCNSENDID2 && newGuildMember.channelId != process.env.NOCNSENDID3 && newGuildMember.channelId != process.env.NOCNSENDID4) {
        if(oldGuildMember.channelId == null && newGuildMember.channelId != null){
            if(client.channels.cache.get(newGuildMember.channelId).members.size==1){
            //時刻等の取得
            let date = new Date();
            let nowy = date.getFullYear();
            let nowm = date.getMonth();
            let nowd = date.getDate();
            let nowh = date.getHours();
            let nowmin = date.getMinutes();
            let nowsec = date.getSeconds();
            let nowdate = `${nowy}/${nowm}/${nowd} ${nowh}:${nowmin}:${nowsec}`;

            client.channels.cache.get(process.env.CNSENDCH).send({
                content: `<@&${process.env.CNROLEID}>\n通話が始まったよ〜！覗いてみてね★`,
                embeds: [{
                    color: 0xF00035,
                    timestamp: new Date(),
                footer: {
                    text: "高識先輩",
                },
                title: `通話開始`,
                fields: [
                    {name: `チャンネル`, value: `<#${newGuildMember.channelId}>`, inline: true},
                    {name: `開始した人`, value: `<@${newGuildMember.id}>`, inline: true},
                    {name: `開始時間`, value: nowdate, inline: true}
                ]
                }],
            });
            start_buf = Date.now();
            }}}
//終了時の動作
if(oldGuildMember.channelId != process.env.NOCNSENDID1 && oldGuildMember.channelId != process.env.NOCNSENDID2 && oldGuildMember.channelId != process.env.NOCNSENDID3 && oldGuildMember.channelId != process.env.NOCNSENDID4) {
    if(newGuildMember.channelId==undefined&&oldGuildMember.channelId!=undefined){
        if(client.channels.cache.get(oldGuildMember.channelId).members.size==0){
        const end_buf = Date.now();
        const totaltime=end_buf-start_buf;
        const hours=Math.floor(totaltime/1000/60/60)%24;
        const min=Math.floor(totaltime/1000/60)%60;
        const sec = Math.floor(totaltime/1000)%60;
        let times= hours+"時間"+min+"分"+sec+"秒";
        client.channels.cache.get(process.env.CNSENDCH).send({
            embeds: [{
            color: 0x001E80,
            timestamp: new Date(),
            footer: {
                text: "高識先輩",
            },
            title: `通話終了`,
            fields: [
                {name: `チャンネル`, value: `<#${oldGuildMember.channelId}>`, inline: true},
                {name: `らすとめんばー`, value: `<@${oldGuildMember.id}>`, inline: true},
                {name: `通話時間`, value: `${times}`, inline: true}
            ]
            }],
    });
    }
}
    }
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

//ログイン
client.login(process.env.BETATOKEN); 