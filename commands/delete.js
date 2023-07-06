const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env'});
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('消します'),
    async execute(intetaction) {
        const channel = client.channels.cache.get(`${process.env.MDCHID}`);
        channel.messages.fetch({ limit: 100 })
            .then(messages => {
                channel.bulkDelete(messages);
            })
            .catch(console.error);
    }
}