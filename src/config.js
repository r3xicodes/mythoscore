import 'dotenv/config';

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID, // optional: for faster dev deploys
  mongoUri: process.env.MONGODB_URI,
  ownerId: process.env.OWNER_ID,
};