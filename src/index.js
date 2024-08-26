require('dotenv').config();
require('colors');

const { GatewayIntentBits } = require('discord.js');
const { createSpinner } = require('nanospinner');

const Bot = require('./Core/Bot');

/**
 *
 * @param {Bot} client
 * @param {'deploy'|'remove'} action
 * @returns {Promise<never>}
 */

async function executeActions(client, action) {
	let spinner;

	spinner = createSpinner(`Connecting ${client.config.username} to the Discord API...`).start();
	await client.loadClient();
	spinner.success({ text: `${client.config.username} has been connected to the Discord API.` });

	switch (action) {
		case 'deploy':
			await client.loadInteractions();

			spinner = createSpinner(`Deploying ${client.config.username} commands...`).start();
			await client.deployClientCommands();
			spinner.success({ text: 'All commands have been deployed.' });

			break;
		case 'remove':
			spinner = createSpinner(`Removing ${client.config.username} commands...`).start();
			await client.removeClientCommands();
			spinner.success({ text: 'All commands have been removed.' });

			break;
	};

	return process.exit();
};

/**
 *
 * @param {'deploy'|'remove'} action
 * @param {'deploy'|'remove'} [secondAction]
 * @returns {Promise<undefined>}
 */

async function main(action, secondAction) {
	const client = new Bot({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildVoiceStates
		],
		allowedMentions: {
			repliedUser: false
		}
	});

	client.options.allowedMentions.users = client.config.utils.devs;

	if (action && action !== 'dev') {
		executeActions(client, action);
	} else {
		if (action === 'dev') {
			client.devMode = true;

			if (secondAction) return executeActions(client, secondAction);
		};
		
		await client.loadAll();
		await client.loadClient(true);
	};

	module.exports = client;
};

main(process.argv[2], process.argv[3]);