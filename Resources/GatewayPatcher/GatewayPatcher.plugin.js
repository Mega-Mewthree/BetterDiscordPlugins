//META{"name":"GatewayPatcher","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Resources/GatewayPatcher","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Resources/GatewayPatcher/GatewayPatcher.plugin.js"}*//

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

class GatewayPatcher {
	getName() {
		return "GatewayPatcher";
	}
	getShortName() {
		return "GatewayPatcher";
	}
	getDescription() {
		return "Exposes the gateway event processing function and allows filtering gateway events.\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.";
	}
	getVersion() {
		return "0.0.1";
	}
	getAuthor() {
		return "Mega_Mewthree"; //Current Discord account: @Lucario 🌌 V5.0.0#7902 (438469378418409483) Wonder how long this one will last...
	}
	constructor() {
		this.settings = {patched: false};
		this.mainScreenPatch =
`
var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var patchedFiles;

try {
	patchedFiles = require('./patchedFiles/files.json');
} catch (e) {
	patchedFiles = {};
}

const jsFileUrls = [];

try {
	_fs2.default.mkdirSync(_path2.default.join(__dirname, 'patchedFiles'));
} catch (e) {}

var modifiedFileInjected = false;

_electron.protocol.registerHttpProtocol('patch', (request, callback) => {
	request.url = _path2.default.normalize(\`\${__dirname}/patchedFiles/\${request.url.substr(8)}\`);
	callback(request);
}, (error) => {
	if (error) console.error('Failed to register protocol');
});

_electron.session.defaultSession.webRequest.onBeforeRequest(['*'], (details, callback) => {
	if (details.url.startsWith('https://status.discordapp.com/') && modifiedFileInjected === false) {
		let fileFound = false;
		for (let i = 0; i < jsFileUrls.length; i++) {
			let url = jsFileUrls[i];
			_https2.default.get(url, res => {
				let data = '';
				res.on('data', chunk => {
					data += chunk;
				});
				res.on('end', () => {
					if (!fileFound && data.indexOf('q.on("dispatch",function(e,t){switch(e){') > -1) {
						fileFound = true;
						const filename = _path2.default.basename(_url2.default.parse(url).pathname);
						try {
							_fs2.default.writeFileSync(
								_path2.default.normalize(\`\${__dirname}/patchedFiles/\${filename}\`),
								data.replace('q.on("dispatch",function(e,t){switch(e){', 'window.gatewayPacketFilters===undefined&&(window.gatewayPacketFilters=[]),q.on("dispatch",window.injectGatewayPacket=function(e,t){window.gatewayPacketFilters.forEach(f=>{[e,t]=f(e,t);});switch(e){'),
								{mode: 0o777}
							);
							patchedFiles[url] = filename;
							_fs2.default.writeFileSync(
								_path2.default.normalize(\`\${__dirname}/patchedFiles/files.json\`),
								JSON.stringify(patchedFiles),
								{mode: 0o777}
							);
							setTimeout(() => {
								_electron.app.relaunch();
								_electron.app.exit();
							}, 3000);
						} catch (e) {}
					}
				});
			})
		}
		return callback({cancel: false});
	}
	if (Object.keys(patchedFiles).indexOf(details.url) > -1) {
		modifiedFileInjected = true;
		return callback({redirectURL: \`patch://\${patchedFiles[details.url]}\`});
	}
	if (details.url.endsWith('.js')) jsFileUrls.push(details.url);
	callback({cancel: false});
});`;

		this.mainScreenPreloadPatch = `\nelectron.webFrame.registerURLSchemeAsPrivileged('patch');`;
	}
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
		this.settings = PluginUtilities.loadSettings(this.getName(), this.settings);
		if (!this.settings.patched) {
			try {
				this.patchClientFiles();
				this.settings.patched = true;
				PluginUtilities.saveSettings(this.getName(), this.settings);
				PluginUtilities.showToast("Successfully installed GatewayPatch! Restarting...", {type: "success"});
				this.restartDiscord();
			} catch (e) {
				PluginUtilities.showToast("An error occured while installing GatewayPatch. If your client fails to load after restarting, please contact the author of this plugin.", {type: "error"});
			}
		}
	}
	stop() {
		try {
			this.unpatchClientFiles();
			this.settings.patched = false;
			PluginUtilities.saveSettings(this.getName(), this.settings);
			PluginUtilities.showToast("Successfully uninstalled GatewayPatch! Restarting...", {type: "success"});
			this.restartDiscord();
		} catch(e) {
			PluginUtilities.showToast("An error occured while uninstalling GatewayPatch. If your client fails to load after restarting, please contact the author of this plugin.", {type: "error"});
		}
	}

	restartDiscord() {
		setTimeout(() => {
			const app = require("electron").remote.app;
			app.relaunch();
			app.exit();
		}, 3000);
	}

	getCorePath() {
		let app = require("electron").remote.app;
		let releaseChannel = require(app.getAppPath() + "/build_info").releaseChannel;
		let discordPath = releaseChannel === "canary" ? "discordcanary" : releaseChannel === "ptb" ? "discordptb" : "discord";
		return `${app.getPath('appData')}/${discordPath}/${app.getVersion()}/modules/discord_desktop_core`;
	}

	patchClientFiles() {
		this.unpatchClientFiles();
		const fs = require("fs");
		const mainScreenPath = `${this.getCorePath()}/core/app/mainScreen.js`;
		const mainScreen = fs.readFileSync(mainScreenPath).toString().split("\n");
		const mainScreenPreloadPath = `${this.getCorePath()}/core/app/mainScreenPreload.js`;
		const mainScreenPreload = fs.readFileSync(mainScreenPreloadPath).toString().split("\n");

		{
			let len = mainScreen.length;
			let line;
			while (len--) {
				line = mainScreen[len];
				if (line.includes("_interopRequireWildcard(_splashScreen)")){
					mainScreen.splice(len + 1, 0, this.mainScreenPatch);
				}
			}
			fs.writeFileSync(mainScreenPath, mainScreen.join("\n"));
		}

		{
			let len = mainScreenPreload.length;
			let line;
			while (len--) {
				line = mainScreenPreload[len];
				if (line.includes("electron = require('electron')")){
					mainScreenPreload.splice(len + 1, 0, this.mainScreenPreloadPatch);
				}
			}
			fs.writeFileSync(mainScreenPreloadPath, mainScreenPreload.join("\n"));
		}
	}

	unpatchClientFiles() {
		const fs = require("fs");
		const mainScreenPath = `${this.getCorePath()}/core/app/mainScreen.js`;
		const mainScreen = fs.readFileSync(mainScreenPath).toString();
		const mainScreenPreloadPath = `${this.getCorePath()}/core/app/mainScreenPreload.js`;
		const mainScreenPreload = fs.readFileSync(mainScreenPreloadPath).toString();

		fs.writeFileSync(mainScreenPath, mainScreen.replace(this.mainScreenPatch + "\n", ""));
		fs.writeFileSync(mainScreenPreloadPath, mainScreenPreload.replace(this.mainScreenPreloadPatch + "\n", ""));
	}
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlr4kqcACgkQf4qgY6Fc
SQskGQf/VtfdvPI6+2gtz7CHF+kRtETuPKBN4frN3r76+lBqPEJm6JRB8SUwk8Mi
g2VTMjf4gAc+N33sJBsXWqaRzyBmwoyjEBPUwcaY2wDYkRRlEJnd1/dfLcvPf3zg
julk54sqdWTgKK7/hHZoZcS1RXIUhQYg/I22milZh4Lu/PNAXq9TCqcOfwFyYod9
gDhV9i2z6oo6UCd0oJb+AF4oXqseXn9ltudwGBMSvB3av7g9zP0tjmnKXyARA3ie
m3mlsKy8QCYPQ+V3X72vN+jbjgayKOGjlMAt2T2O7IBBpjZm3BKqYJl/C2wwEzoH
qw1M2aLQ6J/Al03PSkwEcJVCaRJfkA==
=kuDX
-----END PGP SIGNATURE-----
*/
