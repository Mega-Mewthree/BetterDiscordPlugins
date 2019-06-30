//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js"}*//

// IMPORTANT:
// This is a placeholder for any old links.
// Please go to https://github.com/Mega-Mewthree/BetterDiscordTrustedUnofficialPlugins/tree/master/NoDeleteMessages
// to download this plugin.

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Please go to https://github.com/Mega-Mewthree/BetterDiscordTrustedUnofficialPlugins/tree/master/NoDeleteMessages to download this plugin.';
  }
  getVersion() {
    return "0.0.0";
  }
  getAuthor() {
    return "Mega_Mewthree (original), ShiiroSan (edit logging)";
  }
  constructor() {}
  load() {}
  unload() {}
  start() {
    window.BdApi.alert("NoDeleteMessages Moved", "Please redownload this plugin from https://github.com/Mega-Mewthree/BetterDiscordTrustedUnofficialPlugins/tree/master/NoDeleteMessages.");
  }
  stop() {}
}
