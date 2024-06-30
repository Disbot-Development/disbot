require('colors');

const prompts = require('@clack/prompts');
const Disbot = require('./src/Managers/Disbot');
const { GatewayIntentBits } = require('discord.js');

async function main() {
	prompts.intro(` ${'─'.grey} ${'D'.blue} ${'─'.grey} ${'I'.blue} ${'─'.grey} ${'S'.blue} ${'─'.grey} ${'B'.blue} ${'─'.grey} ${'O'.blue} ${'─'.grey} ${'T'.blue} ${'─'.grey}`);

	const project = await prompts.group(
		{
			mode: () =>
				prompts.select({
					message: 'Select a mode to launch Disbot.',
					initialValue: 'none',
					maxItems: 5,
					options: [
						{ value: 'none', label: 'Default' },
						{ value: 'remove', label: 'Commands removal' },
						{ value: 'deploy', label: 'Commands deployment' }
					],
				}),
		},
		{
			onCancel: () => {
				prompts.cancel('Operation cancelled.');
				process.exit(0);
			},
		}
	);

	prompts.note(
        `Don't stop process during the launch of Disbot.\n` +
        `The first launch may take few seconds.`
    );

	prompts.outro(` ${'─'.grey} ${'D'.blue} ${'─'.grey} ${'I'.blue} ${'─'.grey} ${'S'.blue} ${'─'.grey} ${'B'.blue} ${'─'.grey} ${'O'.blue} ${'─'.grey} ${'T'.blue} ${'─'.grey}`);

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

    client.init();

    client.mode = project.mode;

    module.exports = client;
};

main();