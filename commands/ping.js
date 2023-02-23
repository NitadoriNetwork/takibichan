const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Ping!!'),
    async execute(interaction) {
        try {
        await interaction.reply(`Pong!\n${interaction.client.ws.ping}ms`)
    }catch(error){
    interaction.reply({
        embeds: [{
            fields: [
            {name: 'Error', value: `申し訳ございません！\nエラーが発生しました！`},
            {name: 'ErrorCode', value: '408635'},
            ],
            color: 0xF00035,
            timestamp: new Date(),
            footer: {
                text: "高識先輩",
            },
            }],
            ephemeral: true,
        });
    console.log(`1.エラーが発生しました！ (/ping)`);
    console.log(`2.ErrorCode:408635`);
}
}};