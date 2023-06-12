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
                title: "Issue",
                fields: [
                    {name: "機能名", value: `ステータス`},
                    {name: "新規参加者へのロール自動付与機能の実装", value: `[Complete](https://github.com/NitadoriNetwork/takibichan/issues/1)`, inline: true},
                    {name: "自動削除機能が動かない問題の修正", value: `[Complete](https://github.com/NitadoriNetwork/takibichan/issues/2)`, inline: true},
                    {name: "通話通知発信拒否設定の改善", value: `[Suspended](https://github.com/NitadoriNetwork/takibichan/issues/8)`, inline: true},
                    {name: "Googleカレンダー関連機能", value: `[Suspended](https://github.com/NitadoriNetwork/takibichan/issues/10)`, inline: true},
                    {name: "アナウンス機能の改善", value: `[Suspended](https://github.com/NitadoriNetwork/takibichan/issues/11)`, inline: true},
                    {name: "ガイド系コマンドの修正", value: `[Pending](https://github.com/NitadoriNetwork/takibichan/issues/13)`, inline: true},
                    {name: "botが勝手に落ちる", value: `[Suspended](https://github.com/NitadoriNetwork/takibichan/issues/15)`, inline: true},
                    {name: "問い合わせ発生時に運営にメンションを送信する機能の実装", value: `[Complete](https://github.com/NitadoriNetwork/takibichan/issues/16)`, inline: true},
                    {name: "自動で年齢確認する機能の実装", value: `[Complete](https://github.com/NitadoriNetwork/takibichan/issues/17)`, inline: true}
                ]   
                }],
            })
}};