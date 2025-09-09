import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

if (!config.token || !config.clientId) {
  console.error('Missing required env vars. Check .env');
  process.exit(1);
}

const commands = [];

// Dynamically load command modules
const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs.readdirSync(folderPath)) {
    if (!file.endsWith('.js')) continue;
    const cmdPath = path.join(folderPath, file);
    const command = (await import(pathToFileURL(cmdPath).href)).default;
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `[WARN] Command at ${file} is missing a "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
