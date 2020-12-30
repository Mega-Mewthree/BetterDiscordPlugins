# AutoStartRichPresence

Automatically starts a custom Rich Presence application when you start Discord.

Setup Tutorial: https://www.youtube.com/watch?v=JIUOreTNj-o

![Example](https://cdn.discordapp.com/attachments/444699521398865943/459432393598566420/unknown.png)

My Discord server: https://nebula.mooo.info/discord-invite

DM me `@Lucario ☉ ∝ x²#7902` or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.

## Troubleshooting

### "Rich Presence client ID authentication failed. Make sure your client ID is correct."

1. Check your client ID in the plugin settings to make sure that it matches the client ID for your Rich Presence app in your Discord Applications page.
2. Close Discord, then open the Task Manager (or whatever process manager your OS has) and force kill any remaining Discord processes. Sometimes, Discord orphans some processes for unknown reasons and it messes with IPC.
3. Your computer was not connected to the Internet when the plugin started. Make sure you are connected to the Internet and restart the Discord client.

### "Failed to set Rich Presence activity."

1. You have another application running that has its own Rich Presence, which is conflicting with this plugin. Close all other applications that use Rich Presence and restart the Discord client.
2. Your computer was not connected to the Internet when the plugin started. Make sure you are connected to the Internet and restart the Discord client.
3. Ensure that your button labels and URLs are less than 32 characters long.

### Images do not appear.

1. Wait 24 hours. Discord may take a while to process your images.

### The Rich Presence is not showing 10 seconds after it was started, and there are no visible errors.

1. Make sure the plugin is on.
2. Go to User Settings > Game Activity and turn on Display currently running game as a status message. If it was already on, turn it off, wait 5 seconds, and turn it back on.
3. Disable the experimental RPC event injection setting if you have it enabled, and restart Discord.
4. Wait 3 hours while your Discord client is continuously open. Sometimes, Discord may take a long time to display or update your Rich Presence.

### None of these solutions work.

1. Send me a DM or ping me in the BD support server in the #plugins channel. Due to excessive DMs from people who can't bother to read this troubleshooting guide, I will only respond if you include the phrase "Mago Berry" in your message along with details about your problem and what you have attempted to do in order to solve it (do not just copy and paste my troubleshooting steps).
