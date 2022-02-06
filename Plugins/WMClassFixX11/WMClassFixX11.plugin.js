/**
 * @name WMClassFixX11
 * @version 1.0.0
 *
 * @author Lucario ☉ ∝ x²#7902
 * @authorId 438469378418409483
 * @description Fixes different release channels of Discord having the same WM_CLASS attribute on Linux (X11).
 *
 * This allows you to have different release channels as separate icons in your taskbar and fixes being unable to start
 * PTB/Canary if Stable is running. You should enable this plugin in each release channel you have.
 *
 * Required Dependencies: wmctrl (sudo apt-get install wmctrl), x11-utils (sudo apt-get install x11-utils)
 *
 * @updateUrl https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/WMClassFixX11/WMClassFixX11.plugin.js
 * @invite ZYND2Xd
 * @authorLink https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/WMClassFixX11
 * @source https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/WMClassFixX11
 * @website https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/WMClassFixX11
 * @donate https://www.buymeacoffee.com/lucariodev
 */
/*
MIT License

Copyright (c) 2022 Mega-Mewthree

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

// Created February 5th, 2022.

const version = "1.0.0";

const {promisify} = require("util");
const exec = promisify(require("child_process").exec);

class WMClassFixX11 {
  constructor() {
    this.initialized = false;
  }
  async start() {
    console.log(`Starting ${this.constructor.name}`);
    // Check for updates if ZeresPluginLibrary is available
    window.ZeresPluginLibrary?.PluginUpdater?.checkForUpdate?.(this.constructor.name, version, `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.constructor.name}/${this.constructor.name}.plugin.js`);
    if (require("os").platform() !== "linux") {
      BdApi.showToast(`${this.constructor.name} is for Linux only.`, {type: "error"});
      return;
    }
    try {
      const x11Check = await exec("loginctl show-session $(loginctl | grep $(whoami) | awk '{print $1}') -p Type");
      if (!x11Check.stdout.includes("x11")) {
        BdApi.showToast(`${this.constructor.name} is only compatible with X11.`, {type: "error"});
        return;
      }
      const wmctrlCheck = await exec("which wmctrl || echo -n 1");
      if (wmctrlCheck.stdout === "1") {
        BdApi.alert(this.constructor.name, "Unable to start due to missing dependency: wmctrl.\nPlease install it with `sudo apt-get install wmctrl` and restart this plugin afterwards.");
        return;
      }
      const xpropCheck = await exec("which xprop || echo -n 1");
      if (xpropCheck.stdout === "1") {
        BdApi.alert(this.constructor.name, "Unable to start due to missing dependency: x11-utils.\nPlease install it with `sudo apt-get install x11-utils` and restart this plugin afterwards.");
        return;
      }
      const windowInfo = await exec(`wmctrl -lp | grep ${process.ppid}`);
      const windowID = windowInfo.stdout.split(" ")[0];
      if (!windowID.length) {
        BdApi.showToast(`${this.constructor.name}: Failed to obtain window ID.`, {type: "error"});
        return
      }
      const releaseChannel = BdApi.findModuleByProps("releaseChannel").releaseChannel;
      const result = await exec(`xprop -id ${windowID} -f WM_CLASS 8s -set WM_CLASS "discord-${releaseChannel}"`);
      if (result.stderr.length) {
        BdApi.alert(this.constructor.name, `Failed to replace WM_CLASS:\n${result.stderr}`);
        return;
      }
      BdApi.showToast(`${this.constructor.name} has started!`);
    } catch (e) {
      console.error(`${this.constructor.name}: ${e}`);
      BdApi.showToast(`${this.constructor.name} was unable to start.`, {type: "error"});
    }
  }
  stop() {
    BdApi.showToast(`You must now restart Discord to completely stop ${this.constructor.name}.`);
  }
}

module.exports = WMClassFixX11;
