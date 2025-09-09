# MythosCore — D&D-Inspired Discord Bot

A modular Discord bot featuring character creation, embedded character sheets, inventory/equipment, lore lists, and an owner-only stealth rigged dice system.

## Quickstart
1. **Create a Discord application & bot** in the Developer Portal. Enable **MESSAGE CONTENT INTENT** is **not** required (we use slash commands), but ensure **PRESENCE/GUILD MEMBERS** not needed either.
2. **Clone this project** and create a `.env` from `.env.example`.
3. **Install deps**: `npm install`
4. **Deploy slash commands**: `npm run deploy` (use `GUILD_ID` during dev for faster updates)
5. **Start the bot**: `npm start`
6. **Invite the bot** with scopes `bot applications.commands` and permissions to manage roles if you want the `God Ace` auto-role.

## Notes
- The rig system stores blessed user IDs in MongoDB and treats the owner as always blessed. `/roll` assigns **God Ace** role on rolls ≥ 19 if such a role exists.
- Add custom lore entries by inserting documents into the `Lore` collection (kind: `race|language|class`). You can easily build admin commands to add lore if you like.
- Extend the equipment validation in `equip` if you want class/race restrictions or stat requirements.

## Safety & Transparency
- Stealth rigging is owner-only and invisible to normal players by design. Use responsibly and respect your community's expectations.
