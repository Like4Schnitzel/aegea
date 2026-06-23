import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { discordToken } from '../lib/env';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getJobs, setupDb } from '../lib/dbScripts';
import { createJobTask } from '../lib/jobStore';

type ActualClient = Client<boolean> & {
    commands: Collection<string, { execute: Function }>
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as ActualClient;

client.commands = new Collection();
const COMMAND_DIR_PATH = './src/commands';
const commandFiles = readdirSync(COMMAND_DIR_PATH).filter(file => file.endsWith('.ts'));

await setupDb();
console.log("Interval Types written to DB.");

for (const file of commandFiles) {
    const filePath = join('../commands', file);
    const {default: command} = await import(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as ActualClient).commands.get(interaction.commandName);

    if (!command) {
        console.error('No command matching ${interaction.commandName} was found.');
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true});
    }
});

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const jobs = await getJobs();
    console.log("Jobs loaded:", jobs);
    for (const job of jobs) {
        createJobTask(readyClient, job);
    }
    console.log("Job timeouts created!");
});

client.login(discordToken);
