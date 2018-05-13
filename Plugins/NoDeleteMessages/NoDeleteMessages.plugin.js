//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages/NoDeleteMessages.plugin.js"}*//

/* global PluginUtilities:false */

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

*/

/*
MIT License

Copyright (c) 2018 Mega_Mewthree

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

// Created May 13th, 2018.

class NoDeleteMessages {
	getName() {
		return "NoDeleteMessages";
	}
	getShortName() {
		return "NoDeleteMessages";
	}
	getDescription() {
		return "Prevents the client from removing deleted messages (until restart).\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.\n\nDependencies:\n+ GatewayPatcher";
	}
	getVersion() {
		return "0.0.1";
	}
	getAuthor() {
		return "Mega_Mewthree"; //Current Discord account: @Lucario 🌌 V5.0.0#7902 (438469378418409483) Wonder how long this one will last...
	}
	constructor() {}
	load() {}
	unload() {}
	start() {
    let libraryScript = document.getElementById("zeresLibraryScript");
		if (!window.ZeresLibrary || window.ZeresLibrary.isOutdated) {
			if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
			document.head.appendChild(libraryScript);
		}
		if (window.ZeresLibrary) this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
    if (Array.isArray(window.gatewayPacketFilters)) {
      window.gatewayPacketFilters.unshift(this.gatewayFilter);
    } else {
      const app = require("electron").remote.app;
      const path = require("path");
      let bdsettings = require(path.normalize(`${this.getBetterDiscordPath()}/bdsettings.json`));
      if (Object.keys(bdsettings.plugins).indexOf("GatewayPatcher") > -1) {
        if (bdsettings.plugins.GatewayPatcher) {
          window.gatewayPacketFilters = [this.gatewayFilter];
        } else {
          PluginUtilities.showToast("Please enable GatewayPatcher (a dependency) for NoDeleteMessages to function.", {type: "error"});
        }
      } else {
        const fs = require("fs");
        PluginUtilities.showToast("Installing GatewayPatcher (a dependency). Do not close Discord or your settings can break!", {type: "info"});
        window.fetch("https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Resources/GatewayPatcher/GatewayPatcher.plugin.js")
          .then(res => res.text())
          .then(text => {
            try {
              fs.writeFileSync(
                path.normalize(`${PluginUtilities.getPluginsFolder()}/GatewayPatcher.plugin.js`),
                text,
                {mode: 0o777}
              );
              bdsettings.plugins.GatewayPatcher = true;
              fs.writeFileSync(
                path.normalize(`${this.getBetterDiscordPath()}/bdsettings.json`),
                JSON.stringify(bdsettings),
                {mode: 0o777}
              );
              PluginUtilities.showToast("Successfully installed GatewayPatcher! Restarting...", {type: "success"});
              this.restartDiscord();
            } catch (e) {
              PluginUtilities.showToast("An error occured while installing GatewayPatcher. If your client fails to load after restarting, please contact the author of this plugin.", {type: "error"});
            }
          });
      }
    }
	}
	stop() {
    Array.isArray(window.gatewayPacketFilters) && window.gatewayPacketFilters.splice(window.gatewayPacketFilters.indexOf(this.gatewayFilter), 1);
  }

  gatewayFilter(type, data) {
    if (type === "MESSAGE_DELETE") type = "";
    return [type, data];
  }

	restartDiscord() {
		setTimeout(() => {
			const app = require("electron").remote.app;
			app.relaunch();
			app.exit();
		}, 3000);
	}

	getBetterDiscordPath() {
    const process = require("process");
    const path = require("path");
    switch (process.platform) {
        case "win32":
        return path.resolve(process.env.appdata, "BetterDiscord/");
        case "darwin":
        return path.resolve(process.env.HOME, "Library/Preferences/", "BetterDiscord/");
        default:
        return path.resolve(process.env.HOME, ".config/", "BetterDiscord/");
    }
	}
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlr4sAQACgkQf4qgY6Fc
SQs9rQf/S+KXXVgv8y26AOTk110d+2tv+J5hCNqlM9wwnVbQ06pQ641SJZNwnzCV
G5tSBLexFP5WOHMNxe9tCG21h5GcDmUApZa9NA74LJnrid78UEth6/fj1vKrmDpR
F1n8OGP2L9+jZfQx+TzBKUrEYx1fOaiQ6Bz5sQGk98ukp7aPC8QHfMC4Q7E9Scem
QWPEDpwWtCs94tY7RotFTM7E5ZyK+yjVdd2viFtWxtkCT1bCgXQyYP1dPsnvQP3Y
agxvTCynB8BrdPa6S/AgmF/dJrFx4HMWAn8vyUWJ3G8bcNjHfgBOa/Um7Z5FXVPq
i688/APQGCZ4QbQxt+5sAHMP67tUtQ==
=ALyg
-----END PGP SIGNATURE-----
*/
