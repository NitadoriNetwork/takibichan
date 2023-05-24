const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('issue')
        .setDescription('焚き火ちゃんのIssueに関するやつです'),
    async execute(interaction) {
        await interaction.reply({
            embeds: [{
                color: 0xF00035,
                timestamp: new Date(),
                footer: {
                    text: "焚き火ちゃん",
                },
                title: "[Issue](https://github.com/NitadoriNetwork/takibichan/issues)",
                fields: [
                    {name: "機能名", value: `ステータス`},
                    {name: "[新規参加者へのロール自動付与機能の実装](https://github.com/NitadoriNetwork/takibichan/issues/1)", value: `Complete`, inline: true},
                    {name: "[自動削除機能が動かない問題の修正](https://github.com/NitadoriNetwork/takibichan/issues/2)", value: `Complete`, inline: true},
                    {name: "[通話通知発信拒否設定の改善](https://github.com/NitadoriNetwork/takibichan/issues/8)", value: `Suspended`, inline: true},
                    {name: "[Googleカレンダー関連機能](https://github.com/NitadoriNetwork/takibichan/issues/10)", value: `Suspended`, inline: true},
                    {name: "[アナウンス機能の改善](https://github.com/NitadoriNetwork/takibichan/issues/11)", value: `Suspended`, inline: true},
                    {name: "[ガイド系コマンドの修正](https://github.com/NitadoriNetwork/takibichan/issues/13)", value: `Pending`, inline: true}
                ]
                }],
            })
}};