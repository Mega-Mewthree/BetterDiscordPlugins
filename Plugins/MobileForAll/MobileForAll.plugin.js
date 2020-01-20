//META{"name":"MobileForAll","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/MobileForAll","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/blob/master/Plugins/MobileForAll/MobileForAll.plugin.js"}*//

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

// Updated January 20th, 2020.

class MobileForAll {
  getName() {
    return "MobileForAll";
  }
  getShortName() {
    return "MobileForAll";
  }
  getDescription() {
    return "Adds mobile indicators for all status types.\nRequired dependency: ZeresPluginLibrary\n\nMy Discord server: https://nebula.mooo.info/discord-invite\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.";
  }
  getVersion() {
    return "1.0.0";
  }
  getAuthor() {
    return "Mega_Mewthree"; // Current Discord account: @Lucario ☉ ∝ x²#7902 (438469378418409483)
  }
  constructor() {}
  load() {}
  unload() {}
  start() {
    if (typeof window.ZeresPluginLibrary === "undefined") {
      BdApi.showToast(`${this.getName()}: Please install "ZeresPluginLibrary" and restart this plugin.`, {type: "error"});
    } else {
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
  observer({addedNodes}) {
    const targets = [].filter.call(addedNodes, n => /member/.test(n.className));
    if (targets.length > 0) {
      targets.forEach(target => {
        try {
          const userID = window.ZLibrary.ReactTools.getReactProperty(target, "return.return.return.return.return.return.memoizedProps.user.id");
          if (!userID) return;
          const userStatus = window.ZLibrary.DiscordModules.UserStatusStore.getState().clientStatuses[userID];
          const platforms = Object.keys(userStatus);
          if (platforms.length === 1 && platforms[0] === "mobile" && userStatus.mobile !== "online") {
            const foreignObject = target.children[0].children[0].children[0].children[0].children[0];
            const rect = target.children[0].children[0].children[0].children[0].children[1];
            foreignObject.setAttribute("mask", "url(#svg-mask-avatar-status-mobile-32)");
            rect.setAttribute("mask", "url(#svg-mask-status-online-mobile)");
            rect.setAttribute("height", 15);
            rect.setAttribute("y", 17);
          }
        } catch (e) {}
      });
    }
  }
  async stop() {
    BdApi.showToast(`${this.getName()} has stopped!`);
  }
}
