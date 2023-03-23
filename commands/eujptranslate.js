const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('eurjpy-translate')
        .setDescription('ユーロ/円変換します！')
        .addIntegerOption(option =>
            option.setName('euro')
            .setDescription('ユーロを入力してください')
            .setRequired(true)),
    async execute(interaction) {
        let eu = interaction.options.getInteger('euro');
        const url = fetch('https://fx.mybluemix.net')
            .then((response) => {
            return response.json();
            })
        .then((data) => {
            let eujp = data.rate.EURJPY;
            let yen = eu * eujp;
            interaction.reply({
                embeds: [{
                    title: 'ユーロ円変換',
                    description: `ユーロ/円変換します！(EUR/JPY=${eujp})\n[${data.datetime}]`,
                    color: 0xF00035,
                    timestamp: new Date(),
                    fields: [
                        {name: '入力された金額', value: `€${eu}`, inline: true},
                        {name: '変換後の金額', value: `¥${yen}`, inline: true},
                    ],
                }]
            });
        });
    },
};