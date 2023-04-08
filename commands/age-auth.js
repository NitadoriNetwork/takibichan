const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const webhookClient = new WebhookClient({ url: process.env.AAWEBHOOK});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('age-auth')
		.setDescription('年齢確認申請をします'),
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('auth-message')
			.setTitle('申請フォーム');
		const titleInput = new TextInputBuilder()
			.setCustomId('year')
			.setLabel("生年月日を区切り無しの８桁数字で入力してください")
			.setStyle(TextInputStyle.Short);
		const fiActionRow = new ActionRowBuilder().addComponents(titleInput);
		modal.addComponents(fiActionRow);
		await interaction.showModal(modal);
		const filter = (mInteraction) => mInteraction.customId === 'auth-message';
		interaction.awaitModalSubmit({ filter, time: 100000000 })
			.then(async mInteraction => {
				const title = mInteraction.fields.getTextInputValue('year');
				await mInteraction.reply({
						embeds: [{
						color: 0xF00035,
						timestamp: new Date(),
						footer: {
							text: "高識先輩",
						},
						title: "申請完了",
						fields: [
                            {name: "入力内容", value: title},
                            {name: "申請者", value: `${interaction.user.username}`}
                        ]
						}],
				ephemeral: true
					});
			webhookClient.send({
				username: '焚き火ちゃん',
				avatarURL: process.env.AVATERURL,
                    embeds: [{
                    color: 0xF00035,
                    timestamp: new Date(),
                    footer: {
                        text: "高識先輩",
                    },
                    thumbnail: {
                        url: interaction.user.avatarURL(),
                    },
					title: "年齢申請フォーム",
					fields: [
                        {name: "入力内容", value: title},
                        {name: "申請者", value: `${interaction.user.username}`},
                        {name: "ID", value: `${interaction.user.id}`}
                    ]
				}],
                });
			})
			.catch(console.error);
	},
};