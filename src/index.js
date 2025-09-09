import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import mongoose from 'mongoose';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';   // ✅ needed for Windows-safe dynamic imports

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

if (!config.token || !config.clientId || !config.mongoUri) {
  console.error('Missing required env vars. Check .env');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Dynamically load command modules
const commandsPath = path.join(process.cwd(), 'src', 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs.readdirSync(folderPath)) {
    if (!file.endsWith('.js')) continue;
    const cmdPath = path.join(folderPath, file);
    const cmd = (await import(pathToFileURL(cmdPath).href)).default; // ✅ convert to file:// URL
    client.commands.set(cmd.data.name, cmd);
  }
}

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
  // MongoDB connection (uncomment when ready)
  // try {
  //   await mongoose.connect(config.mongoUri);
  //   console.log('✅ MongoDB connected');
  // } catch (e) {
  //   console.error('MongoDB connection error:', e);
  // }
  // If you see 'MongoDB connection error: Error: querySrv ENOTFOUND', check your .env for a valid MONGODB_URI.
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({
        content: '⚠️ Oops, something went wrong.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '⚠️ Oops, something went wrong.',
        ephemeral: true,
      });
    }
  }
});

client.login(config.token);
