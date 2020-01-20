//META{"name":"ColorSighted","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/ColorSighted","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/blob/master/Plugins/ColorSighted/ColorSighted.plugin.js"}*//

/*
MIT License

Copyright (c) 2020 Mega_Mewthree

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Updated January 19th, 2020.

class ColorSighted {
  getName() {
    return "ColorSighted";
  }
  getShortName() {
    return "ColorSighted";
  }
  getDescription() {
    return "Are you not a colorblind person? This plugin removes the colorblind status indicators and replaces them with fully circular ones, just like how they used to be.\nRequired dependency: ZeresPluginLibrary\n\nMy Discord server: https://nebula.mooo.info/discord-invite\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.";
  }
  getVersion() {
    return "1.0.0";
  }
  getAuthor() {
    return "Mega_Mewthree"; // Current Discord account: @Lucario ☉ ∝ x²#7902 (438469378418409483)
  }
  constructor() {
    this.originalMaskIDs = {};
    this.MaskIDs = null;
  }
  load() {}
  unload() {}
  start() {
    if (typeof window.ZeresPluginLibrary === "undefined") {
      BdApi.showToast(`${this.getName()}: Please install "ZeresPluginLibrary" and restart this plugin.`, {type: "error"});
    } else {
      this.MaskIDs = window.ZLibrary.WebpackModules.getByProps("MaskIDs").MaskIDs;
      ["STATUS_IDLE", "STATUS_DND", "STATUS_OFFLINE", "STATUS_STREAMING"].forEach(maskName => {
        this.originalMaskIDs[maskName] = this.MaskIDs[maskName];
        this.MaskIDs[maskName] = this.MaskIDs.STATUS_ONLINE;
      });
      if (window.ZeresPluginLibrary.PluginUtilities && typeof window.ZeresPluginLibrary.PluginUtilities.checkForUpdate === "function") {
        try {
          window.ZeresPluginLibrary.PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);
        } catch (e) {
          console.error(e);
        }
      }
      BdApi.showToast(`${this.getName()} has started!`);
    }
  }
  async stop() {
    for (const maskName of Object.keys(this.originalMaskIDs)) {
      this.MaskIDs[maskName] = this.originalMaskIDs[maskName];
    }
    BdApi.showToast(`${this.getName()} has stopped!`);
  }
}
