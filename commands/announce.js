const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const webhookClient = new WebhookClient({ url: process.env.ANWEBHOOK});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('アナウンスメッセージを作成します！'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('embed-message')
			.setTitle('埋め込みメッセージの作成');
		const titleInput = new TextInputBuilder()
			.setCustomId('title')
			.setLabel("タイトルの入力")
			.setStyle(TextInputStyle.Short);
        const fieldInput = new TextInputBuilder()
            .setCustomId('field')
            .setLabel("本文の入力")
            .setStyle(TextInputStyle.Paragraph);
		const contentInput = new TextInputBuilder()
			.setCustomId('content')
			.setLabel("メンションとかする用")
			.setStyle(TextInputStyle.Short);
		const fiActionRow = new ActionRowBuilder().addComponents(titleInput);
		const seActionRow = new ActionRowBuilder().addComponents(fieldInput);
		const thActionRow = new ActionRowBuilder().addComponents(contentInput);
		modal.addComponents(fiActionRow, seActionRow, thActionRow);
		await interaction.showModal(modal);
		const filter = (mInteraction) => mInteraction.customId === 'embed-message';
		interaction.awaitModalSubmit({ filter, time: 100000000 })
			.then(async mInteraction => {
				const title = mInteraction.fields.getTextInputValue('title');
                const field = mInteraction.fields.getTextInputValue('field');
				const content = mInteraction.fields.getTextInputValue('content');
				await mInteraction.reply({
						content: content,
						embeds: [{
						color: 0xF00035,
						timestamp: new Date(),
						footer: {
							text: "焚き火ちゃん",
						},
						title: title,
						description: field
						}],
				ephemeral: true
					});
			webhookClient.send({
				content: content,
				username: '焚き火ちゃん',
				avatarURL: process.env.AVATERURL,
                    embeds: [{
                    color: 0xF00035,
                    timestamp: new Date(),
                    footer: {
                        text: "焚き火ちゃん",
                    },
					title: title,
					description: field
				}],
                });
			})
			.catch(console.error);
	},
};