const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const webhookClient = new WebhookClient({ url: process.env.AAWEBHOOK});
const rule = /^[0-9]{8}$/

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
				let result = rule.test(title);
				if ( result === true ) {
					await mInteraction.reply({
							embeds: [{
							color: 0xF00035,
							timestamp: new Date(),
							footer: {
								text: "焚き火ちゃん",
							},
							title: "申請完了",
							fields: [
                    	        {name: "入力内容", value: title},
                    	        {name: "申請者", value: `${interaction.user.username}`}
                        	]
							}],
					ephemeral: true
						});
						let date = new Date();
						let nowy = date.getFullYear();
						let nowm = date.getMonth();
						let nowd = date.getDate();
						let nowdate = Number(`${nowy}${nowm}${nowd}`);
						if ( title >= nowdate) {
							interaction.member.roles.add('1041387252560969738');
						} 
					webhookClient.send({
						username: '焚き火ちゃん',
						avatarURL: process.env.AVATERURL,
            	        embeds: [{
	    	        	    color: 0xF00035,
    	    	        	timestamp: new Date(),
	    		            footer: {
	    		                text: "焚き火ちゃん",
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
				} else {
					await mInteraction.reply({
						embeds: [{
						color: 0xF00035,
						timestamp: new Date(),
						footer: {
							text: "焚き火ちゃん",
						},
						title: "Error",
						fields: [
							{name: "Error", value: `入力された内容は半角数字8桁ではありません。`},
						]
						}],
					ephemeral: true
					});
				}
				})
				.catch(console.error);
		},
};	