require('colors');
require('dotenv').config();

const { createSpinner } = require('nanospinner');
const Disbot = require('./src/Managers/Disbot');
const { GatewayIntentBits } = require('discord.js');

async function main() {
    const client = new Disbot({
        intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent
		],
        allowedMentions: {
            repliedUser: false
        }
    });

    client.options.allowedMentions.roles = Object.values(client.config.roles).map((id) => id);
    client.options.allowedMentions.users = client.config.utils.devs;
	
	let spinner;
	switch(process.argv[2]) {
		case 'deploy':
			spinner = createSpinner('Connecting Disbot to the Discord API...').start();
			await client.loadClient(true);
			spinner.success({ text: `Disbot has been connected to the Discord API.\n` });

			client.loadCommands();
			client.loadContextMenus();

			console.log();

			spinner = createSpinner('Deploying Disbot commands...').start();
			await client.deployClientCommands();
			spinner.success({ text: `All commands has been deployed.` });

			process.exit();
		case 'remove':
			spinner = createSpinner('Connecting Disbot to the Discord API...').start();
			await client.loadClient(true);
			spinner.success({ text: `Disbot has been connected to the Discord API.` });
			
			spinner = createSpinner('Removing Disbot commands...').start();
			await client.removeClientCommands();
			spinner.success({ text: `All commands has been removed.` });
			
			process.exit();
		default:
			await client.init();
			
			break;
	};

    module.exports = client;
};

main();