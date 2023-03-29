const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const webhookClient = new WebhookClient({ url: process.env.OBWEBHOOK});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('opinion-box')
		.setDescription('意見箱'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('embed-opinion')
			.setTitle('ご意見等の送信');
        const fieldInput = new TextInputBuilder()
            .setCustomId('field')
            .setLabel("本文の入力")
            .setStyle(TextInputStyle.Paragraph);
		const seActionRow = new ActionRowBuilder().addComponents(fieldInput);
		modal.addComponents(seActionRow);
		await interaction.showModal(modal);
		const filter = (mInteraction) => mInteraction.customId === 'embed-opinion';
		interaction.awaitModalSubmit({ filter, time: 1000000000 })
			.then(async mInteraction => {
                const field = mInteraction.fields.getTextInputValue('field');
				await mInteraction.reply({
                    embeds: [{
                        timestamp: new Date(),
                        color: 0xF00035,
                        footer: {
                            text: "高識先輩",
                        },
						title: `ご意見を送信しました！`,
						description: field
					}],
					ephemeral: true,
                    },
                );
				webhookClient.send({
					username: '焚き火ちゃん',
					avatarURL: process.env.AVATERURL,
					embeds: [{
						color: 0xF00035,
						timestamp: new Date(),
						footer: {
							text: "焚き火ちゃん",
						},
						title: `意見が届きました！`,
						description: field
					}],
				});
            })
			.catch(console.error);
	},
};