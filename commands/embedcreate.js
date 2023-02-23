const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed-create')
		.setDescription('埋め込みメッセージを作成します！'),
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
		const fiActionRow = new ActionRowBuilder().addComponents(titleInput);
		const seActionRow = new ActionRowBuilder().addComponents(fieldInput);
		modal.addComponents(fiActionRow, seActionRow);
		await interaction.showModal(modal);
		const filter = (mInteraction) => mInteraction.customId === 'embed-message';
		interaction.awaitModalSubmit({ filter, time: 60000 })
			.then(async mInteraction => {
				const title = mInteraction.fields.getTextInputValue('title');
                const field = mInteraction.fields.getTextInputValue('field');
				await mInteraction.reply({
                    embeds: [{
                        timestamp: new Date(),
                        color: 0xF00035,
                        timestamp: new Date(),
                        footer: {
                            text: "高識先輩",
                        },
                    	title: title,
						description: field
					}],
                    },
                );
			})
			.catch(console.error);
	},
};