import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { clientId, discordToken } from "../lib/env";
import { readdirSync } from "node:fs";

const COMMAND_DIR_PATH = './src/commands';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandFiles = readdirSync(COMMAND_DIR_PATH).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);
    try {
        commands.push(command.data.toJSON());
    } catch {
        commands.push(command.data);
    }
}

const rest = new REST({version:'10'}).setToken(discordToken);

(async () => {
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		) as any[];

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
