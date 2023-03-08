const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('usdjpy-translate')
        .setDescription('ドル円変換します！')
        .addIntegerOption(option =>
            option.setName('dollar')
            .setDescription('米ドルを入力してください')
            .setRequired(true)),
    async execute(interaction) {
        let dol = interaction.options.getInteger('dollar');
        const surl = fetch('https://fx.mybluemix.net')
            .then((response) => {
            return response.json();
            })
        .then((data) => {
            try {
            let usjp = data.rate.USDJPY;
            let yen = dol * usjp;
            interaction.reply({
                embeds: [{
                    title: 'ドル円変換',
                    description: `ドル円変換します！(USD/JPY=${usjp})`,
                    color: 0xF00035,
                    timestamp: new Date(),
                    footer: {
                        text: "焚き火ちゃん",
                    },
                    fields: [
                        {name: '入力された金額', value: `$${dol}`, inline: true},
                        {name: '変換後の金額', value: `¥${yen}`, inline: true},
                    ],
                }]
            });
        } catch(error){
            interaction.reply({
                embeds: [{
                    fields: [
                    {name: 'Error', value: `申し訳ございません！エラーが発生しました！`}],
                    color: 0xF00035,
                    timestamp: new Date(),
                    footer: {
                        text: "焚き火ちゃん",
                    },
                    }],
                    ephemeral: true,
                });
            console.log(`1.エラーが発生しました！ (/usdjpy-translate)`);
        }});
    },
};
