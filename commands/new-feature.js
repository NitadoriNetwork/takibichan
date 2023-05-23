const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('new-feature')
        .setDescription('焚き火ちゃんに実装予定のそういうやつに関する情報です'),
    async execute(interaction) {
        await interaction.reply({
            embeds: [{
                color: 0xF00035,
                timestamp: new Date(),
                footer: {
                    text: "焚き火ちゃん",
                },
                title: "new-feature",
                fields: [
                    {name: "機能名", value: `ステータス`},
                    {name: "Googleカレンダー関連機能", value: `Suspended`, inline: true},
                    {name: "通話通知発信拒否設定の改善", value: `Suspended`, inline: true},
                    {name: "アナウンス機能の改善", value: `Suspended`, inline: true},
                    {name: "ガイド系コマンドの修正", value: `Pending`, inline: true}
                ]
                }],
            })
}};