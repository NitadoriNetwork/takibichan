const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('message-create')
        .setDescription('メッセージを作成します')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('内容を入力してください')
                .setRequired(true)),
    async execute(interaction) {
        let msg = interaction.options.getString('input');
        await interaction.reply(`${msg}`);
    }}