/**
 * @name ColorSighted
 * @version 1.0.1
 *
 * @author Lucario ☉ ∝ x²#7902
 * @authorId 438469378418409483
 * @description Are you not a colorblind person? This plugin removes the colorblind status indicators and replaces them with fully circular ones, just like how they used to be.
 * Required dependency: ZeresPluginLibrary
 *
 * DM the author or create an issue for support.
 *
 * @updateUrl https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/ColorSighted/ColorSighted.plugin.js
 * @invite ZYND2Xd
 * @authorLink https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/ColorSighted
 * @source https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/ColorSighted
 * @website https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/ColorSighted
 * @donate https://www.buymeacoffee.com/lucariodev
 */
/*
MIT License

Copyright (c) 2020-2021 Mega-Mewthree

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

// Updated June 16th, 2021.

class ColorSighted {
  constructor() {
    this.originalMaskIDs = {};
    this.MaskIDs = null;
  }
  start() {
    if (typeof window.ZeresPluginLibrary === "undefined") {
      BdApi.showToast(`${this.constructor.name}: Please install "ZeresPluginLibrary" and restart this plugin.`, {type: "error"});
    } else {
      this.MaskIDs = window.ZLibrary.WebpackModules.getByProps("MaskIDs").MaskIDs;
      ["STATUS_IDLE", "STATUS_DND", "STATUS_OFFLINE", "STATUS_STREAMING"].forEach(maskName => {
        this.originalMaskIDs[maskName] = this.MaskIDs[maskName];
        this.MaskIDs[maskName] = this.MaskIDs.STATUS_ONLINE;
      });
      window.ZeresPluginLibrary?.PluginUpdater?.checkForUpdate?.(this.constructor.name, BdApi.Plugins.get(this.constructor.name).version, `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.constructor.name}/${this.constructor.name}.plugin.js`);
      BdApi.showToast(`${this.constructor.name} has started!`);
    }
  }
  async stop() {
    for (const maskName of Object.keys(this.originalMaskIDs)) {
      this.MaskIDs[maskName] = this.originalMaskIDs[maskName];
    }
    BdApi.showToast(`${this.constructor.name} has stopped!`);
  }
}
