import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs.readdirSync(folderPath)) {
    if (!file.endsWith('.js')) continue;
    const cmd = (await import(path.join(folderPath, file))).default;
    commands.push(cmd.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Deploying ${commands.length} application (/) commands...`);
    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
      console.log('✅ Guild commands deployed.');
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      console.log('✅ Global commands deployed.');
    }
  } catch (error) {
    console.error(error);
  }
})();