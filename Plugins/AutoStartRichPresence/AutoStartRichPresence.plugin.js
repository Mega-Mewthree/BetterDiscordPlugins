/**
 * @name AutoStartRichPresence
 * @version 2.0.4
 *
 * @author Lucario ☉ ∝ x²#7902
 * @authorId 438469378418409483
 * @description Auto starts Rich Presence with configurable settings.
 *
 * Check the website for [troubleshooting/FAQs](https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence#troubleshooting) before requesting support.
 * DM the author or create an issue for support.
 *
 * @updateUrl https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js
 * @invite ZYND2Xd
 * @authorLink https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence
 * @source https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence
 * @website https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence
 * @donate https://www.buymeacoffee.com/lucariodev
 */
/*
MIT License

Copyright (c) 2018-2021 Mega-Mewthree

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

// Updated June 19th, 2021.

const changelog = {
  title: "AutoStartRichPresence Updated",
  version: "2.0.4",
  changelog: [
    {
      title: "v2.0.0: Rich presence profiles have been added!",
      type: "added",
      items: [
        "You can now create multiple rich presence configurations and switch between them quickly.",
        "Your settings have been automatically migrated to a new format that is not compatible with older versions.",
        "Please report any bugs with the new profile system."
      ]
    },
    {
      title: "v2.0.1: Bug Fixes",
      type: "fixed",
      items: [
        "Having no buttons no longer causes an error when not using RPC event injection.",
        "Switching RPC injection on and off quickly no longer crashes the client."
      ]
    },
    {
      title: "v2.0.2: Update Checker",
      type: "fixed",
      items: [
        "Added back update check that was too hastily replaced with @updateUrl earlier since @updateUrl does not currently work.",
        "The previous update check was broken anyway due to using the wrong/old class, so no harm done."
      ]
    },
    {
      title: "v2.0.3: Button Label Validation",
      type: "fixed",
      items: [
        "Button labels are now checked to ensure they are smaller than 32 characters in length.",
        "Button labels that exceed the limit will now cause an error to appear, and the button will simply be removed rather than having the entire rich presence fail.",
        "Some settings that should not have trailing whitespaces are now trimmed on save."
      ]
    },
    {
      title: "v2.0.4: ZeresPluginLibrary Download Prompt",
      type: "fixed",
      items: [
        "The plugin will now automatically prompt you to download ZeresPluginLibrary if it is not already installed."
      ]
    }
  ]
};

// Might not be strict enough, but most people are probably not attempting to use weird URLs
const validButtonURLRegex = /^http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

let RPClient;

(() => {
  const path = require("path");
  const fs = require("fs");
  const EventEmitter = require("events");
  const {
    Buffer
  } = require("buffer");

  // snekfetch library
  let snekfetch;
  (() => {
  	/*
  	  MIT License

  	  Copyright (c) 2017 Gus Caplan

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
  	let transport;
  	(() => {
  		const zlib = require('zlib');
  		const {
  			parse: UrlParse,
  			resolve: UrlResolve
  		} = require('url');
  		let socket;
  		(() => {
  			const tls = require('tls');
  			const http = require('http');
  			const https = require('https');
  			// lazy require http2 because it emits a warning
  			let http2;

  			const hasHttp2 = (() => {
  				const [a, b, c] = process.version.split('.');
  				return (+a.slice(1) * 0x1000) + (+b * 0x100) + +c >= 38912;
  			})();
  			const ALPNProtocols = hasHttp2 ? ['h2', 'http/1.1'] : ['http/1.1'];

  			function connectHttp(opt) {
  				const req = http.request(opt);
  				return Promise.resolve({
  					req
  				});
  			}

  			function http2req(connection, opt) {
  				return connection.request(Object.assign({
  					':path': opt.path,
  					':method': opt.method,
  					':authority': opt.host,
  				}, opt.headers));
  			}

  			function connectHttps(opt) {
  				return new Promise((resolve, reject) => {
  					const port = opt.port = +opt.port || 443;
  					const socket = tls.connect({
  						host: opt.host,
  						port,
  						servername: opt.host,
  						ALPNProtocols,
  					});
  					socket.once('error', reject);
  					socket.once('secureConnect', () => {
  						switch (socket.alpnProtocol) {
  							case false:
  							case 'http/1.1':
  								{
  									const req = https.request(Object.assign({
  										createConnection: () => socket,
  									}, opt));
  									resolve({
  										req
  									});
  									break;
  								}
  							case 'h2':
  								{
  									if (http2 === undefined) {
  										http2 = require('http2');
  									}

  									const connection = http2.connect({
  										host: opt.host,
  										port,
  									}, {
  										createConnection: () => socket,
  									});

  									connection.port = opt.port;
  									connection.host = opt.host;

  									const req = http2req(connection, opt);
  									resolve({
  										req,
  										http2: true,
  										connection
  									});
  									break;
  								}
  							default:
  								reject(new Error(`No supported ALPN protocol was negotiated, got ${socket.alpnProtocol}`));
  								break;
  						}
  					});
  				});
  			}

  			socket = (options) =>
  				(options.protocol === 'https:' ? connectHttps : connectHttp)(options);

  			socket.http2req = http2req;
  		})();
  		const Stream = require('stream');
  		const querystring = require('querystring');
  		const {
  			METHODS,
  			STATUS_CODES
  		} = require('http');
  		let FormData;
  		(() => {
  			const path = require('path');
  			let mime;
  			(() => {
  				const mimes = {
  					"123": "application/vnd.lotus-1-2-3",
  					"ez": "application/andrew-inset",
  					"aw": "application/applixware",
  					"atom": "application/atom+xml",
  					"atomcat": "application/atomcat+xml",
  					"atomsvc": "application/atomsvc+xml",
  					"bdoc": "application/x-bdoc",
  					"ccxml": "application/ccxml+xml",
  					"cdmia": "application/cdmi-capability",
  					"cdmic": "application/cdmi-container",
  					"cdmid": "application/cdmi-domain",
  					"cdmio": "application/cdmi-object",
  					"cdmiq": "application/cdmi-queue",
  					"cu": "application/cu-seeme",
  					"mpd": "application/dash+xml",
  					"davmount": "application/davmount+xml",
  					"dbk": "application/docbook+xml",
  					"dssc": "application/dssc+der",
  					"xdssc": "application/dssc+xml",
  					"ecma": "application/ecmascript",
  					"emma": "application/emma+xml",
  					"epub": "application/epub+zip",
  					"exi": "application/exi",
  					"pfr": "application/font-tdpfr",
  					"woff": "application/font-woff",
  					"woff2": "application/font-woff2",
  					"geojson": "application/geo+json",
  					"gml": "application/gml+xml",
  					"gpx": "application/gpx+xml",
  					"gxf": "application/gxf",
  					"stk": "application/hyperstudio",
  					"ink": "application/inkml+xml",
  					"inkml": "application/inkml+xml",
  					"ipfix": "application/ipfix",
  					"jar": "application/java-archive",
  					"war": "application/java-archive",
  					"ear": "application/java-archive",
  					"ser": "application/java-serialized-object",
  					"class": "application/java-vm",
  					"js": "application/javascript",
  					"json": "application/json",
  					"map": "application/json",
  					"json5": "application/json5",
  					"jsonml": "application/jsonml+json",
  					"jsonld": "application/ld+json",
  					"lostxml": "application/lost+xml",
  					"hqx": "application/mac-binhex40",
  					"cpt": "application/mac-compactpro",
  					"mads": "application/mads+xml",
  					"webmanifest": "application/manifest+json",
  					"mrc": "application/marc",
  					"mrcx": "application/marcxml+xml",
  					"ma": "application/mathematica",
  					"nb": "application/mathematica",
  					"mb": "application/mathematica",
  					"mathml": "application/mathml+xml",
  					"mbox": "application/mbox",
  					"mscml": "application/mediaservercontrol+xml",
  					"metalink": "application/metalink+xml",
  					"meta4": "application/metalink4+xml",
  					"mets": "application/mets+xml",
  					"mods": "application/mods+xml",
  					"m21": "application/mp21",
  					"mp21": "application/mp21",
  					"mp4s": "application/mp4",
  					"m4p": "application/mp4",
  					"doc": "application/msword",
  					"dot": "application/msword",
  					"mxf": "application/mxf",
  					"bin": "application/octet-stream",
  					"dms": "application/octet-stream",
  					"lrf": "application/octet-stream",
  					"mar": "application/octet-stream",
  					"so": "application/octet-stream",
  					"dist": "application/octet-stream",
  					"distz": "application/octet-stream",
  					"pkg": "application/octet-stream",
  					"bpk": "application/octet-stream",
  					"dump": "application/octet-stream",
  					"elc": "application/octet-stream",
  					"deploy": "application/octet-stream",
  					"exe": "application/x-msdownload",
  					"dll": "application/x-msdownload",
  					"deb": "application/x-debian-package",
  					"dmg": "application/x-apple-diskimage",
  					"iso": "application/x-iso9660-image",
  					"img": "application/octet-stream",
  					"msi": "application/x-msdownload",
  					"msp": "application/octet-stream",
  					"msm": "application/octet-stream",
  					"buffer": "application/octet-stream",
  					"oda": "application/oda",
  					"opf": "application/oebps-package+xml",
  					"ogx": "application/ogg",
  					"omdoc": "application/omdoc+xml",
  					"onetoc": "application/onenote",
  					"onetoc2": "application/onenote",
  					"onetmp": "application/onenote",
  					"onepkg": "application/onenote",
  					"oxps": "application/oxps",
  					"xer": "application/patch-ops-error+xml",
  					"pdf": "application/pdf",
  					"pgp": "application/pgp-encrypted",
  					"asc": "application/pgp-signature",
  					"sig": "application/pgp-signature",
  					"prf": "application/pics-rules",
  					"p10": "application/pkcs10",
  					"p7m": "application/pkcs7-mime",
  					"p7c": "application/pkcs7-mime",
  					"p7s": "application/pkcs7-signature",
  					"p8": "application/pkcs8",
  					"ac": "application/pkix-attr-cert",
  					"cer": "application/pkix-cert",
  					"crl": "application/pkix-crl",
  					"pkipath": "application/pkix-pkipath",
  					"pki": "application/pkixcmp",
  					"pls": "application/pls+xml",
  					"ai": "application/postscript",
  					"eps": "application/postscript",
  					"ps": "application/postscript",
  					"cww": "application/prs.cww",
  					"pskcxml": "application/pskc+xml",
  					"rdf": "application/rdf+xml",
  					"rif": "application/reginfo+xml",
  					"rnc": "application/relax-ng-compact-syntax",
  					"rl": "application/resource-lists+xml",
  					"rld": "application/resource-lists-diff+xml",
  					"rs": "application/rls-services+xml",
  					"gbr": "application/rpki-ghostbusters",
  					"mft": "application/rpki-manifest",
  					"roa": "application/rpki-roa",
  					"rsd": "application/rsd+xml",
  					"rss": "application/rss+xml",
  					"rtf": "text/rtf",
  					"sbml": "application/sbml+xml",
  					"scq": "application/scvp-cv-request",
  					"scs": "application/scvp-cv-response",
  					"spq": "application/scvp-vp-request",
  					"spp": "application/scvp-vp-response",
  					"sdp": "application/sdp",
  					"setpay": "application/set-payment-initiation",
  					"setreg": "application/set-registration-initiation",
  					"shf": "application/shf+xml",
  					"smi": "application/smil+xml",
  					"smil": "application/smil+xml",
  					"rq": "application/sparql-query",
  					"srx": "application/sparql-results+xml",
  					"gram": "application/srgs",
  					"grxml": "application/srgs+xml",
  					"sru": "application/sru+xml",
  					"ssdl": "application/ssdl+xml",
  					"ssml": "application/ssml+xml",
  					"tei": "application/tei+xml",
  					"teicorpus": "application/tei+xml",
  					"tfi": "application/thraud+xml",
  					"tsd": "application/timestamped-data",
  					"plb": "application/vnd.3gpp.pic-bw-large",
  					"psb": "application/vnd.3gpp.pic-bw-small",
  					"pvb": "application/vnd.3gpp.pic-bw-var",
  					"tcap": "application/vnd.3gpp2.tcap",
  					"pwn": "application/vnd.3m.post-it-notes",
  					"aso": "application/vnd.accpac.simply.aso",
  					"imp": "application/vnd.accpac.simply.imp",
  					"acu": "application/vnd.acucobol",
  					"atc": "application/vnd.acucorp",
  					"acutc": "application/vnd.acucorp",
  					"air": "application/vnd.adobe.air-application-installer-package+zip",
  					"fcdt": "application/vnd.adobe.formscentral.fcdt",
  					"fxp": "application/vnd.adobe.fxp",
  					"fxpl": "application/vnd.adobe.fxp",
  					"xdp": "application/vnd.adobe.xdp+xml",
  					"xfdf": "application/vnd.adobe.xfdf",
  					"ahead": "application/vnd.ahead.space",
  					"azf": "application/vnd.airzip.filesecure.azf",
  					"azs": "application/vnd.airzip.filesecure.azs",
  					"azw": "application/vnd.amazon.ebook",
  					"acc": "application/vnd.americandynamics.acc",
  					"ami": "application/vnd.amiga.ami",
  					"apk": "application/vnd.android.package-archive",
  					"cii": "application/vnd.anser-web-certificate-issue-initiation",
  					"fti": "application/vnd.anser-web-funds-transfer-initiation",
  					"atx": "application/vnd.antix.game-component",
  					"mpkg": "application/vnd.apple.installer+xml",
  					"m3u8": "application/vnd.apple.mpegurl",
  					"pkpass": "application/vnd.apple.pkpass",
  					"swi": "application/vnd.aristanetworks.swi",
  					"iota": "application/vnd.astraea-software.iota",
  					"aep": "application/vnd.audiograph",
  					"mpm": "application/vnd.blueice.multipass",
  					"bmi": "application/vnd.bmi",
  					"rep": "application/vnd.businessobjects",
  					"cdxml": "application/vnd.chemdraw+xml",
  					"mmd": "application/vnd.chipnuts.karaoke-mmd",
  					"cdy": "application/vnd.cinderella",
  					"cla": "application/vnd.claymore",
  					"rp9": "application/vnd.cloanto.rp9",
  					"c4g": "application/vnd.clonk.c4group",
  					"c4d": "application/vnd.clonk.c4group",
  					"c4f": "application/vnd.clonk.c4group",
  					"c4p": "application/vnd.clonk.c4group",
  					"c4u": "application/vnd.clonk.c4group",
  					"c11amc": "application/vnd.cluetrust.cartomobile-config",
  					"c11amz": "application/vnd.cluetrust.cartomobile-config-pkg",
  					"csp": "application/vnd.commonspace",
  					"cdbcmsg": "application/vnd.contact.cmsg",
  					"cmc": "application/vnd.cosmocaller",
  					"clkx": "application/vnd.crick.clicker",
  					"clkk": "application/vnd.crick.clicker.keyboard",
  					"clkp": "application/vnd.crick.clicker.palette",
  					"clkt": "application/vnd.crick.clicker.template",
  					"clkw": "application/vnd.crick.clicker.wordbank",
  					"wbs": "application/vnd.criticaltools.wbs+xml",
  					"pml": "application/vnd.ctc-posml",
  					"ppd": "application/vnd.cups-ppd",
  					"car": "application/vnd.curl.car",
  					"pcurl": "application/vnd.curl.pcurl",
  					"dart": "application/vnd.dart",
  					"rdz": "application/vnd.data-vision.rdz",
  					"uvf": "application/vnd.dece.data",
  					"uvvf": "application/vnd.dece.data",
  					"uvd": "application/vnd.dece.data",
  					"uvvd": "application/vnd.dece.data",
  					"uvt": "application/vnd.dece.ttml+xml",
  					"uvvt": "application/vnd.dece.ttml+xml",
  					"uvx": "application/vnd.dece.unspecified",
  					"uvvx": "application/vnd.dece.unspecified",
  					"uvz": "application/vnd.dece.zip",
  					"uvvz": "application/vnd.dece.zip",
  					"fe_launch": "application/vnd.denovo.fcselayout-link",
  					"dna": "application/vnd.dna",
  					"mlp": "application/vnd.dolby.mlp",
  					"dpg": "application/vnd.dpgraph",
  					"dfac": "application/vnd.dreamfactory",
  					"kpxx": "application/vnd.ds-keypoint",
  					"ait": "application/vnd.dvb.ait",
  					"svc": "application/vnd.dvb.service",
  					"geo": "application/vnd.dynageo",
  					"mag": "application/vnd.ecowin.chart",
  					"nml": "application/vnd.enliven",
  					"esf": "application/vnd.epson.esf",
  					"msf": "application/vnd.epson.msf",
  					"qam": "application/vnd.epson.quickanime",
  					"slt": "application/vnd.epson.salt",
  					"ssf": "application/vnd.epson.ssf",
  					"es3": "application/vnd.eszigno3+xml",
  					"et3": "application/vnd.eszigno3+xml",
  					"ez2": "application/vnd.ezpix-album",
  					"ez3": "application/vnd.ezpix-package",
  					"fdf": "application/vnd.fdf",
  					"mseed": "application/vnd.fdsn.mseed",
  					"seed": "application/vnd.fdsn.seed",
  					"dataless": "application/vnd.fdsn.seed",
  					"gph": "application/vnd.flographit",
  					"ftc": "application/vnd.fluxtime.clip",
  					"fm": "application/vnd.framemaker",
  					"frame": "application/vnd.framemaker",
  					"maker": "application/vnd.framemaker",
  					"book": "application/vnd.framemaker",
  					"fnc": "application/vnd.frogans.fnc",
  					"ltf": "application/vnd.frogans.ltf",
  					"fsc": "application/vnd.fsc.weblaunch",
  					"oas": "application/vnd.fujitsu.oasys",
  					"oa2": "application/vnd.fujitsu.oasys2",
  					"oa3": "application/vnd.fujitsu.oasys3",
  					"fg5": "application/vnd.fujitsu.oasysgp",
  					"bh2": "application/vnd.fujitsu.oasysprs",
  					"ddd": "application/vnd.fujixerox.ddd",
  					"xdw": "application/vnd.fujixerox.docuworks",
  					"xbd": "application/vnd.fujixerox.docuworks.binder",
  					"fzs": "application/vnd.fuzzysheet",
  					"txd": "application/vnd.genomatix.tuxedo",
  					"ggb": "application/vnd.geogebra.file",
  					"ggt": "application/vnd.geogebra.tool",
  					"gex": "application/vnd.geometry-explorer",
  					"gre": "application/vnd.geometry-explorer",
  					"gxt": "application/vnd.geonext",
  					"g2w": "application/vnd.geoplan",
  					"g3w": "application/vnd.geospace",
  					"gmx": "application/vnd.gmx",
  					"gdoc": "application/vnd.google-apps.document",
  					"gslides": "application/vnd.google-apps.presentation",
  					"gsheet": "application/vnd.google-apps.spreadsheet",
  					"kml": "application/vnd.google-earth.kml+xml",
  					"kmz": "application/vnd.google-earth.kmz",
  					"gqf": "application/vnd.grafeq",
  					"gqs": "application/vnd.grafeq",
  					"gac": "application/vnd.groove-account",
  					"ghf": "application/vnd.groove-help",
  					"gim": "application/vnd.groove-identity-message",
  					"grv": "application/vnd.groove-injector",
  					"gtm": "application/vnd.groove-tool-message",
  					"tpl": "application/vnd.groove-tool-template",
  					"vcg": "application/vnd.groove-vcard",
  					"hal": "application/vnd.hal+xml",
  					"zmm": "application/vnd.handheld-entertainment+xml",
  					"hbci": "application/vnd.hbci",
  					"les": "application/vnd.hhe.lesson-player",
  					"hpgl": "application/vnd.hp-hpgl",
  					"hpid": "application/vnd.hp-hpid",
  					"hps": "application/vnd.hp-hps",
  					"jlt": "application/vnd.hp-jlyt",
  					"pcl": "application/vnd.hp-pcl",
  					"pclxl": "application/vnd.hp-pclxl",
  					"sfd-hdstx": "application/vnd.hydrostatix.sof-data",
  					"mpy": "application/vnd.ibm.minipay",
  					"afp": "application/vnd.ibm.modcap",
  					"listafp": "application/vnd.ibm.modcap",
  					"list3820": "application/vnd.ibm.modcap",
  					"irm": "application/vnd.ibm.rights-management",
  					"sc": "application/vnd.ibm.secure-container",
  					"icc": "application/vnd.iccprofile",
  					"icm": "application/vnd.iccprofile",
  					"igl": "application/vnd.igloader",
  					"ivp": "application/vnd.immervision-ivp",
  					"ivu": "application/vnd.immervision-ivu",
  					"igm": "application/vnd.insors.igm",
  					"xpw": "application/vnd.intercon.formnet",
  					"xpx": "application/vnd.intercon.formnet",
  					"i2g": "application/vnd.intergeo",
  					"qbo": "application/vnd.intu.qbo",
  					"qfx": "application/vnd.intu.qfx",
  					"rcprofile": "application/vnd.ipunplugged.rcprofile",
  					"irp": "application/vnd.irepository.package+xml",
  					"xpr": "application/vnd.is-xpr",
  					"fcs": "application/vnd.isac.fcs",
  					"jam": "application/vnd.jam",
  					"rms": "application/vnd.jcp.javame.midlet-rms",
  					"jisp": "application/vnd.jisp",
  					"joda": "application/vnd.joost.joda-archive",
  					"ktz": "application/vnd.kahootz",
  					"ktr": "application/vnd.kahootz",
  					"karbon": "application/vnd.kde.karbon",
  					"chrt": "application/vnd.kde.kchart",
  					"kfo": "application/vnd.kde.kformula",
  					"flw": "application/vnd.kde.kivio",
  					"kon": "application/vnd.kde.kontour",
  					"kpr": "application/vnd.kde.kpresenter",
  					"kpt": "application/vnd.kde.kpresenter",
  					"ksp": "application/vnd.kde.kspread",
  					"kwd": "application/vnd.kde.kword",
  					"kwt": "application/vnd.kde.kword",
  					"htke": "application/vnd.kenameaapp",
  					"kia": "application/vnd.kidspiration",
  					"kne": "application/vnd.kinar",
  					"knp": "application/vnd.kinar",
  					"skp": "application/vnd.koan",
  					"skd": "application/vnd.koan",
  					"skt": "application/vnd.koan",
  					"skm": "application/vnd.koan",
  					"sse": "application/vnd.kodak-descriptor",
  					"lasxml": "application/vnd.las.las+xml",
  					"lbd": "application/vnd.llamagraphics.life-balance.desktop",
  					"lbe": "application/vnd.llamagraphics.life-balance.exchange+xml",
  					"apr": "application/vnd.lotus-approach",
  					"pre": "application/vnd.lotus-freelance",
  					"nsf": "application/vnd.lotus-notes",
  					"org": "application/vnd.lotus-organizer",
  					"scm": "application/vnd.lotus-screencam",
  					"lwp": "application/vnd.lotus-wordpro",
  					"portpkg": "application/vnd.macports.portpkg",
  					"mcd": "application/vnd.mcd",
  					"mc1": "application/vnd.medcalcdata",
  					"cdkey": "application/vnd.mediastation.cdkey",
  					"mwf": "application/vnd.mfer",
  					"mfm": "application/vnd.mfmp",
  					"flo": "application/vnd.micrografx.flo",
  					"igx": "application/vnd.micrografx.igx",
  					"mif": "application/vnd.mif",
  					"daf": "application/vnd.mobius.daf",
  					"dis": "application/vnd.mobius.dis",
  					"mbk": "application/vnd.mobius.mbk",
  					"mqy": "application/vnd.mobius.mqy",
  					"msl": "application/vnd.mobius.msl",
  					"plc": "application/vnd.mobius.plc",
  					"txf": "application/vnd.mobius.txf",
  					"mpn": "application/vnd.mophun.application",
  					"mpc": "application/vnd.mophun.certificate",
  					"xul": "application/vnd.mozilla.xul+xml",
  					"cil": "application/vnd.ms-artgalry",
  					"cab": "application/vnd.ms-cab-compressed",
  					"xls": "application/vnd.ms-excel",
  					"xlm": "application/vnd.ms-excel",
  					"xla": "application/vnd.ms-excel",
  					"xlc": "application/vnd.ms-excel",
  					"xlt": "application/vnd.ms-excel",
  					"xlw": "application/vnd.ms-excel",
  					"xlam": "application/vnd.ms-excel.addin.macroenabled.12",
  					"xlsb": "application/vnd.ms-excel.sheet.binary.macroenabled.12",
  					"xlsm": "application/vnd.ms-excel.sheet.macroenabled.12",
  					"xltm": "application/vnd.ms-excel.template.macroenabled.12",
  					"eot": "application/vnd.ms-fontobject",
  					"chm": "application/vnd.ms-htmlhelp",
  					"ims": "application/vnd.ms-ims",
  					"lrm": "application/vnd.ms-lrm",
  					"thmx": "application/vnd.ms-officetheme",
  					"cat": "application/vnd.ms-pki.seccat",
  					"stl": "application/vnd.ms-pki.stl",
  					"ppt": "application/vnd.ms-powerpoint",
  					"pps": "application/vnd.ms-powerpoint",
  					"pot": "application/vnd.ms-powerpoint",
  					"ppam": "application/vnd.ms-powerpoint.addin.macroenabled.12",
  					"pptm": "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  					"sldm": "application/vnd.ms-powerpoint.slide.macroenabled.12",
  					"ppsm": "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  					"potm": "application/vnd.ms-powerpoint.template.macroenabled.12",
  					"mpp": "application/vnd.ms-project",
  					"mpt": "application/vnd.ms-project",
  					"docm": "application/vnd.ms-word.document.macroenabled.12",
  					"dotm": "application/vnd.ms-word.template.macroenabled.12",
  					"wps": "application/vnd.ms-works",
  					"wks": "application/vnd.ms-works",
  					"wcm": "application/vnd.ms-works",
  					"wdb": "application/vnd.ms-works",
  					"wpl": "application/vnd.ms-wpl",
  					"xps": "application/vnd.ms-xpsdocument",
  					"mseq": "application/vnd.mseq",
  					"mus": "application/vnd.musician",
  					"msty": "application/vnd.muvee.style",
  					"taglet": "application/vnd.mynfc",
  					"nlu": "application/vnd.neurolanguage.nlu",
  					"ntf": "application/vnd.nitf",
  					"nitf": "application/vnd.nitf",
  					"nnd": "application/vnd.noblenet-directory",
  					"nns": "application/vnd.noblenet-sealer",
  					"nnw": "application/vnd.noblenet-web",
  					"ngdat": "application/vnd.nokia.n-gage.data",
  					"n-gage": "application/vnd.nokia.n-gage.symbian.install",
  					"rpst": "application/vnd.nokia.radio-preset",
  					"rpss": "application/vnd.nokia.radio-presets",
  					"edm": "application/vnd.novadigm.edm",
  					"edx": "application/vnd.novadigm.edx",
  					"ext": "application/vnd.novadigm.ext",
  					"odc": "application/vnd.oasis.opendocument.chart",
  					"otc": "application/vnd.oasis.opendocument.chart-template",
  					"odb": "application/vnd.oasis.opendocument.database",
  					"odf": "application/vnd.oasis.opendocument.formula",
  					"odft": "application/vnd.oasis.opendocument.formula-template",
  					"odg": "application/vnd.oasis.opendocument.graphics",
  					"otg": "application/vnd.oasis.opendocument.graphics-template",
  					"odi": "application/vnd.oasis.opendocument.image",
  					"oti": "application/vnd.oasis.opendocument.image-template",
  					"odp": "application/vnd.oasis.opendocument.presentation",
  					"otp": "application/vnd.oasis.opendocument.presentation-template",
  					"ods": "application/vnd.oasis.opendocument.spreadsheet",
  					"ots": "application/vnd.oasis.opendocument.spreadsheet-template",
  					"odt": "application/vnd.oasis.opendocument.text",
  					"odm": "application/vnd.oasis.opendocument.text-master",
  					"ott": "application/vnd.oasis.opendocument.text-template",
  					"oth": "application/vnd.oasis.opendocument.text-web",
  					"xo": "application/vnd.olpc-sugar",
  					"dd2": "application/vnd.oma.dd2+xml",
  					"oxt": "application/vnd.openofficeorg.extension",
  					"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  					"sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide",
  					"ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  					"potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
  					"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  					"xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  					"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  					"dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  					"mgp": "application/vnd.osgeo.mapguide.package",
  					"dp": "application/vnd.osgi.dp",
  					"esa": "application/vnd.osgi.subsystem",
  					"pdb": "application/x-pilot",
  					"pqa": "application/vnd.palm",
  					"oprc": "application/vnd.palm",
  					"paw": "application/vnd.pawaafile",
  					"str": "application/vnd.pg.format",
  					"ei6": "application/vnd.pg.osasli",
  					"efif": "application/vnd.picsel",
  					"wg": "application/vnd.pmi.widget",
  					"plf": "application/vnd.pocketlearn",
  					"pbd": "application/vnd.powerbuilder6",
  					"box": "application/vnd.previewsystems.box",
  					"mgz": "application/vnd.proteus.magazine",
  					"qps": "application/vnd.publishare-delta-tree",
  					"ptid": "application/vnd.pvi.ptid1",
  					"qxd": "application/vnd.quark.quarkxpress",
  					"qxt": "application/vnd.quark.quarkxpress",
  					"qwd": "application/vnd.quark.quarkxpress",
  					"qwt": "application/vnd.quark.quarkxpress",
  					"qxl": "application/vnd.quark.quarkxpress",
  					"qxb": "application/vnd.quark.quarkxpress",
  					"bed": "application/vnd.realvnc.bed",
  					"mxl": "application/vnd.recordare.musicxml",
  					"musicxml": "application/vnd.recordare.musicxml+xml",
  					"cryptonote": "application/vnd.rig.cryptonote",
  					"cod": "application/vnd.rim.cod",
  					"rm": "application/vnd.rn-realmedia",
  					"rmvb": "application/vnd.rn-realmedia-vbr",
  					"link66": "application/vnd.route66.link66+xml",
  					"st": "application/vnd.sailingtracker.track",
  					"see": "application/vnd.seemail",
  					"sema": "application/vnd.sema",
  					"semd": "application/vnd.semd",
  					"semf": "application/vnd.semf",
  					"ifm": "application/vnd.shana.informed.formdata",
  					"itp": "application/vnd.shana.informed.formtemplate",
  					"iif": "application/vnd.shana.informed.interchange",
  					"ipk": "application/vnd.shana.informed.package",
  					"twd": "application/vnd.simtech-mindmapper",
  					"twds": "application/vnd.simtech-mindmapper",
  					"mmf": "application/vnd.smaf",
  					"teacher": "application/vnd.smart.teacher",
  					"sdkm": "application/vnd.solent.sdkm+xml",
  					"sdkd": "application/vnd.solent.sdkm+xml",
  					"dxp": "application/vnd.spotfire.dxp",
  					"sfs": "application/vnd.spotfire.sfs",
  					"sdc": "application/vnd.stardivision.calc",
  					"sda": "application/vnd.stardivision.draw",
  					"sdd": "application/vnd.stardivision.impress",
  					"smf": "application/vnd.stardivision.math",
  					"sdw": "application/vnd.stardivision.writer",
  					"vor": "application/vnd.stardivision.writer",
  					"sgl": "application/vnd.stardivision.writer-global",
  					"smzip": "application/vnd.stepmania.package",
  					"sm": "application/vnd.stepmania.stepchart",
  					"sxc": "application/vnd.sun.xml.calc",
  					"stc": "application/vnd.sun.xml.calc.template",
  					"sxd": "application/vnd.sun.xml.draw",
  					"std": "application/vnd.sun.xml.draw.template",
  					"sxi": "application/vnd.sun.xml.impress",
  					"sti": "application/vnd.sun.xml.impress.template",
  					"sxm": "application/vnd.sun.xml.math",
  					"sxw": "application/vnd.sun.xml.writer",
  					"sxg": "application/vnd.sun.xml.writer.global",
  					"stw": "application/vnd.sun.xml.writer.template",
  					"sus": "application/vnd.sus-calendar",
  					"susp": "application/vnd.sus-calendar",
  					"svd": "application/vnd.svd",
  					"sis": "application/vnd.symbian.install",
  					"sisx": "application/vnd.symbian.install",
  					"xsm": "application/vnd.syncml+xml",
  					"bdm": "application/vnd.syncml.dm+wbxml",
  					"xdm": "application/vnd.syncml.dm+xml",
  					"tao": "application/vnd.tao.intent-module-archive",
  					"pcap": "application/vnd.tcpdump.pcap",
  					"cap": "application/vnd.tcpdump.pcap",
  					"dmp": "application/vnd.tcpdump.pcap",
  					"tmo": "application/vnd.tmobile-livetv",
  					"tpt": "application/vnd.trid.tpt",
  					"mxs": "application/vnd.triscape.mxs",
  					"tra": "application/vnd.trueapp",
  					"ufd": "application/vnd.ufdl",
  					"ufdl": "application/vnd.ufdl",
  					"utz": "application/vnd.uiq.theme",
  					"umj": "application/vnd.umajin",
  					"unityweb": "application/vnd.unity",
  					"uoml": "application/vnd.uoml+xml",
  					"vcx": "application/vnd.vcx",
  					"vsd": "application/vnd.visio",
  					"vst": "application/vnd.visio",
  					"vss": "application/vnd.visio",
  					"vsw": "application/vnd.visio",
  					"vis": "application/vnd.visionary",
  					"vsf": "application/vnd.vsf",
  					"wbxml": "application/vnd.wap.wbxml",
  					"wmlc": "application/vnd.wap.wmlc",
  					"wmlsc": "application/vnd.wap.wmlscriptc",
  					"wtb": "application/vnd.webturbo",
  					"nbp": "application/vnd.wolfram.player",
  					"wpd": "application/vnd.wordperfect",
  					"wqd": "application/vnd.wqd",
  					"stf": "application/vnd.wt.stf",
  					"xar": "application/vnd.xara",
  					"xfdl": "application/vnd.xfdl",
  					"hvd": "application/vnd.yamaha.hv-dic",
  					"hvs": "application/vnd.yamaha.hv-script",
  					"hvp": "application/vnd.yamaha.hv-voice",
  					"osf": "application/vnd.yamaha.openscoreformat",
  					"osfpvg": "application/vnd.yamaha.openscoreformat.osfpvg+xml",
  					"saf": "application/vnd.yamaha.smaf-audio",
  					"spf": "application/vnd.yamaha.smaf-phrase",
  					"cmp": "application/vnd.yellowriver-custom-menu",
  					"zir": "application/vnd.zul",
  					"zirz": "application/vnd.zul",
  					"zaz": "application/vnd.zzazz.deck+xml",
  					"vxml": "application/voicexml+xml",
  					"wgt": "application/widget",
  					"hlp": "application/winhlp",
  					"wsdl": "application/wsdl+xml",
  					"wspolicy": "application/wspolicy+xml",
  					"7z": "application/x-7z-compressed",
  					"abw": "application/x-abiword",
  					"ace": "application/x-ace-compressed",
  					"aab": "application/x-authorware-bin",
  					"x32": "application/x-authorware-bin",
  					"u32": "application/x-authorware-bin",
  					"vox": "application/x-authorware-bin",
  					"aam": "application/x-authorware-map",
  					"aas": "application/x-authorware-seg",
  					"bcpio": "application/x-bcpio",
  					"torrent": "application/x-bittorrent",
  					"blb": "application/x-blorb",
  					"blorb": "application/x-blorb",
  					"bz": "application/x-bzip",
  					"bz2": "application/x-bzip2",
  					"boz": "application/x-bzip2",
  					"cbr": "application/x-cbr",
  					"cba": "application/x-cbr",
  					"cbt": "application/x-cbr",
  					"cbz": "application/x-cbr",
  					"cb7": "application/x-cbr",
  					"vcd": "application/x-cdlink",
  					"cfs": "application/x-cfs-compressed",
  					"chat": "application/x-chat",
  					"pgn": "application/x-chess-pgn",
  					"crx": "application/x-chrome-extension",
  					"cco": "application/x-cocoa",
  					"nsc": "application/x-conference",
  					"cpio": "application/x-cpio",
  					"csh": "application/x-csh",
  					"udeb": "application/x-debian-package",
  					"dgc": "application/x-dgc-compressed",
  					"dir": "application/x-director",
  					"dcr": "application/x-director",
  					"dxr": "application/x-director",
  					"cst": "application/x-director",
  					"cct": "application/x-director",
  					"cxt": "application/x-director",
  					"w3d": "application/x-director",
  					"fgd": "application/x-director",
  					"swa": "application/x-director",
  					"wad": "application/x-doom",
  					"ncx": "application/x-dtbncx+xml",
  					"dtb": "application/x-dtbook+xml",
  					"res": "application/x-dtbresource+xml",
  					"dvi": "application/x-dvi",
  					"evy": "application/x-envoy",
  					"eva": "application/x-eva",
  					"bdf": "application/x-font-bdf",
  					"gsf": "application/x-font-ghostscript",
  					"psf": "application/x-font-linux-psf",
  					"otf": "font/opentype",
  					"pcf": "application/x-font-pcf",
  					"snf": "application/x-font-snf",
  					"ttf": "application/x-font-ttf",
  					"ttc": "application/x-font-ttf",
  					"pfa": "application/x-font-type1",
  					"pfb": "application/x-font-type1",
  					"pfm": "application/x-font-type1",
  					"afm": "application/x-font-type1",
  					"arc": "application/x-freearc",
  					"spl": "application/x-futuresplash",
  					"gca": "application/x-gca-compressed",
  					"ulx": "application/x-glulx",
  					"gnumeric": "application/x-gnumeric",
  					"gramps": "application/x-gramps-xml",
  					"gtar": "application/x-gtar",
  					"hdf": "application/x-hdf",
  					"php": "application/x-httpd-php",
  					"install": "application/x-install-instructions",
  					"jardiff": "application/x-java-archive-diff",
  					"jnlp": "application/x-java-jnlp-file",
  					"latex": "application/x-latex",
  					"luac": "application/x-lua-bytecode",
  					"lzh": "application/x-lzh-compressed",
  					"lha": "application/x-lzh-compressed",
  					"run": "application/x-makeself",
  					"mie": "application/x-mie",
  					"prc": "application/x-pilot",
  					"mobi": "application/x-mobipocket-ebook",
  					"application": "application/x-ms-application",
  					"lnk": "application/x-ms-shortcut",
  					"wmd": "application/x-ms-wmd",
  					"wmz": "application/x-msmetafile",
  					"xbap": "application/x-ms-xbap",
  					"mdb": "application/x-msaccess",
  					"obd": "application/x-msbinder",
  					"crd": "application/x-mscardfile",
  					"clp": "application/x-msclip",
  					"com": "application/x-msdownload",
  					"bat": "application/x-msdownload",
  					"mvb": "application/x-msmediaview",
  					"m13": "application/x-msmediaview",
  					"m14": "application/x-msmediaview",
  					"wmf": "application/x-msmetafile",
  					"emf": "application/x-msmetafile",
  					"emz": "application/x-msmetafile",
  					"mny": "application/x-msmoney",
  					"pub": "application/x-mspublisher",
  					"scd": "application/x-msschedule",
  					"trm": "application/x-msterminal",
  					"wri": "application/x-mswrite",
  					"nc": "application/x-netcdf",
  					"cdf": "application/x-netcdf",
  					"pac": "application/x-ns-proxy-autoconfig",
  					"nzb": "application/x-nzb",
  					"pl": "application/x-perl",
  					"pm": "application/x-perl",
  					"p12": "application/x-pkcs12",
  					"pfx": "application/x-pkcs12",
  					"p7b": "application/x-pkcs7-certificates",
  					"spc": "application/x-pkcs7-certificates",
  					"p7r": "application/x-pkcs7-certreqresp",
  					"rar": "application/x-rar-compressed",
  					"rpm": "application/x-redhat-package-manager",
  					"ris": "application/x-research-info-systems",
  					"sea": "application/x-sea",
  					"sh": "application/x-sh",
  					"shar": "application/x-shar",
  					"swf": "application/x-shockwave-flash",
  					"xap": "application/x-silverlight-app",
  					"sql": "application/x-sql",
  					"sit": "application/x-stuffit",
  					"sitx": "application/x-stuffitx",
  					"srt": "application/x-subrip",
  					"sv4cpio": "application/x-sv4cpio",
  					"sv4crc": "application/x-sv4crc",
  					"t3": "application/x-t3vm-image",
  					"gam": "application/x-tads",
  					"tar": "application/x-tar",
  					"tcl": "application/x-tcl",
  					"tk": "application/x-tcl",
  					"tex": "application/x-tex",
  					"tfm": "application/x-tex-tfm",
  					"texinfo": "application/x-texinfo",
  					"texi": "application/x-texinfo",
  					"obj": "application/x-tgif",
  					"ustar": "application/x-ustar",
  					"src": "application/x-wais-source",
  					"webapp": "application/x-web-app-manifest+json",
  					"der": "application/x-x509-ca-cert",
  					"crt": "application/x-x509-ca-cert",
  					"pem": "application/x-x509-ca-cert",
  					"fig": "application/x-xfig",
  					"xlf": "application/x-xliff+xml",
  					"xpi": "application/x-xpinstall",
  					"xz": "application/x-xz",
  					"z1": "application/x-zmachine",
  					"z2": "application/x-zmachine",
  					"z3": "application/x-zmachine",
  					"z4": "application/x-zmachine",
  					"z5": "application/x-zmachine",
  					"z6": "application/x-zmachine",
  					"z7": "application/x-zmachine",
  					"z8": "application/x-zmachine",
  					"xaml": "application/xaml+xml",
  					"xdf": "application/xcap-diff+xml",
  					"xenc": "application/xenc+xml",
  					"xhtml": "application/xhtml+xml",
  					"xht": "application/xhtml+xml",
  					"xml": "text/xml",
  					"xsl": "application/xml",
  					"xsd": "application/xml",
  					"rng": "application/xml",
  					"dtd": "application/xml-dtd",
  					"xop": "application/xop+xml",
  					"xpl": "application/xproc+xml",
  					"xslt": "application/xslt+xml",
  					"xspf": "application/xspf+xml",
  					"mxml": "application/xv+xml",
  					"xhvml": "application/xv+xml",
  					"xvml": "application/xv+xml",
  					"xvm": "application/xv+xml",
  					"yang": "application/yang",
  					"yin": "application/yin+xml",
  					"zip": "application/zip",
  					"3gpp": "video/3gpp",
  					"adp": "audio/adpcm",
  					"au": "audio/basic",
  					"snd": "audio/basic",
  					"mid": "audio/midi",
  					"midi": "audio/midi",
  					"kar": "audio/midi",
  					"rmi": "audio/midi",
  					"mp3": "audio/mpeg",
  					"m4a": "audio/x-m4a",
  					"mp4a": "audio/mp4",
  					"mpga": "audio/mpeg",
  					"mp2": "audio/mpeg",
  					"mp2a": "audio/mpeg",
  					"m2a": "audio/mpeg",
  					"m3a": "audio/mpeg",
  					"oga": "audio/ogg",
  					"ogg": "audio/ogg",
  					"spx": "audio/ogg",
  					"s3m": "audio/s3m",
  					"sil": "audio/silk",
  					"uva": "audio/vnd.dece.audio",
  					"uvva": "audio/vnd.dece.audio",
  					"eol": "audio/vnd.digital-winds",
  					"dra": "audio/vnd.dra",
  					"dts": "audio/vnd.dts",
  					"dtshd": "audio/vnd.dts.hd",
  					"lvp": "audio/vnd.lucent.voice",
  					"pya": "audio/vnd.ms-playready.media.pya",
  					"ecelp4800": "audio/vnd.nuera.ecelp4800",
  					"ecelp7470": "audio/vnd.nuera.ecelp7470",
  					"ecelp9600": "audio/vnd.nuera.ecelp9600",
  					"rip": "audio/vnd.rip",
  					"wav": "audio/x-wav",
  					"weba": "audio/webm",
  					"aac": "audio/x-aac",
  					"aif": "audio/x-aiff",
  					"aiff": "audio/x-aiff",
  					"aifc": "audio/x-aiff",
  					"caf": "audio/x-caf",
  					"flac": "audio/x-flac",
  					"mka": "audio/x-matroska",
  					"m3u": "audio/x-mpegurl",
  					"wax": "audio/x-ms-wax",
  					"wma": "audio/x-ms-wma",
  					"ram": "audio/x-pn-realaudio",
  					"ra": "audio/x-realaudio",
  					"rmp": "audio/x-pn-realaudio-plugin",
  					"xm": "audio/xm",
  					"cdx": "chemical/x-cdx",
  					"cif": "chemical/x-cif",
  					"cmdf": "chemical/x-cmdf",
  					"cml": "chemical/x-cml",
  					"csml": "chemical/x-csml",
  					"xyz": "chemical/x-xyz",
  					"bmp": "image/x-ms-bmp",
  					"cgm": "image/cgm",
  					"g3": "image/g3fax",
  					"gif": "image/gif",
  					"ief": "image/ief",
  					"jpeg": "image/jpeg",
  					"jpg": "image/jpeg",
  					"jpe": "image/jpeg",
  					"ktx": "image/ktx",
  					"png": "image/png",
  					"btif": "image/prs.btif",
  					"sgi": "image/sgi",
  					"svg": "image/svg+xml",
  					"svgz": "image/svg+xml",
  					"tiff": "image/tiff",
  					"tif": "image/tiff",
  					"psd": "image/vnd.adobe.photoshop",
  					"uvi": "image/vnd.dece.graphic",
  					"uvvi": "image/vnd.dece.graphic",
  					"uvg": "image/vnd.dece.graphic",
  					"uvvg": "image/vnd.dece.graphic",
  					"djvu": "image/vnd.djvu",
  					"djv": "image/vnd.djvu",
  					"sub": "text/vnd.dvb.subtitle",
  					"dwg": "image/vnd.dwg",
  					"dxf": "image/vnd.dxf",
  					"fbs": "image/vnd.fastbidsheet",
  					"fpx": "image/vnd.fpx",
  					"fst": "image/vnd.fst",
  					"mmr": "image/vnd.fujixerox.edmics-mmr",
  					"rlc": "image/vnd.fujixerox.edmics-rlc",
  					"mdi": "image/vnd.ms-modi",
  					"wdp": "image/vnd.ms-photo",
  					"npx": "image/vnd.net-fpx",
  					"wbmp": "image/vnd.wap.wbmp",
  					"xif": "image/vnd.xiff",
  					"webp": "image/webp",
  					"3ds": "image/x-3ds",
  					"ras": "image/x-cmu-raster",
  					"cmx": "image/x-cmx",
  					"fh": "image/x-freehand",
  					"fhc": "image/x-freehand",
  					"fh4": "image/x-freehand",
  					"fh5": "image/x-freehand",
  					"fh7": "image/x-freehand",
  					"ico": "image/x-icon",
  					"jng": "image/x-jng",
  					"sid": "image/x-mrsid-image",
  					"pcx": "image/x-pcx",
  					"pic": "image/x-pict",
  					"pct": "image/x-pict",
  					"pnm": "image/x-portable-anymap",
  					"pbm": "image/x-portable-bitmap",
  					"pgm": "image/x-portable-graymap",
  					"ppm": "image/x-portable-pixmap",
  					"rgb": "image/x-rgb",
  					"tga": "image/x-tga",
  					"xbm": "image/x-xbitmap",
  					"xpm": "image/x-xpixmap",
  					"xwd": "image/x-xwindowdump",
  					"eml": "message/rfc822",
  					"mime": "message/rfc822",
  					"igs": "model/iges",
  					"iges": "model/iges",
  					"msh": "model/mesh",
  					"mesh": "model/mesh",
  					"silo": "model/mesh",
  					"dae": "model/vnd.collada+xml",
  					"dwf": "model/vnd.dwf",
  					"gdl": "model/vnd.gdl",
  					"gtw": "model/vnd.gtw",
  					"mts": "model/vnd.mts",
  					"vtu": "model/vnd.vtu",
  					"wrl": "model/vrml",
  					"vrml": "model/vrml",
  					"x3db": "model/x3d+binary",
  					"x3dbz": "model/x3d+binary",
  					"x3dv": "model/x3d+vrml",
  					"x3dvz": "model/x3d+vrml",
  					"x3d": "model/x3d+xml",
  					"x3dz": "model/x3d+xml",
  					"appcache": "text/cache-manifest",
  					"manifest": "text/cache-manifest",
  					"ics": "text/calendar",
  					"ifb": "text/calendar",
  					"coffee": "text/coffeescript",
  					"litcoffee": "text/coffeescript",
  					"css": "text/css",
  					"csv": "text/csv",
  					"hjson": "text/hjson",
  					"html": "text/html",
  					"htm": "text/html",
  					"shtml": "text/html",
  					"jade": "text/jade",
  					"jsx": "text/jsx",
  					"less": "text/less",
  					"mml": "text/mathml",
  					"n3": "text/n3",
  					"txt": "text/plain",
  					"text": "text/plain",
  					"conf": "text/plain",
  					"def": "text/plain",
  					"list": "text/plain",
  					"log": "text/plain",
  					"in": "text/plain",
  					"ini": "text/plain",
  					"dsc": "text/prs.lines.tag",
  					"rtx": "text/richtext",
  					"sgml": "text/sgml",
  					"sgm": "text/sgml",
  					"slim": "text/slim",
  					"slm": "text/slim",
  					"stylus": "text/stylus",
  					"styl": "text/stylus",
  					"tsv": "text/tab-separated-values",
  					"t": "text/troff",
  					"tr": "text/troff",
  					"roff": "text/troff",
  					"man": "text/troff",
  					"me": "text/troff",
  					"ms": "text/troff",
  					"ttl": "text/turtle",
  					"uri": "text/uri-list",
  					"uris": "text/uri-list",
  					"urls": "text/uri-list",
  					"vcard": "text/vcard",
  					"curl": "text/vnd.curl",
  					"dcurl": "text/vnd.curl.dcurl",
  					"mcurl": "text/vnd.curl.mcurl",
  					"scurl": "text/vnd.curl.scurl",
  					"fly": "text/vnd.fly",
  					"flx": "text/vnd.fmi.flexstor",
  					"gv": "text/vnd.graphviz",
  					"3dml": "text/vnd.in3d.3dml",
  					"spot": "text/vnd.in3d.spot",
  					"jad": "text/vnd.sun.j2me.app-descriptor",
  					"wml": "text/vnd.wap.wml",
  					"wmls": "text/vnd.wap.wmlscript",
  					"vtt": "text/vtt",
  					"s": "text/x-asm",
  					"asm": "text/x-asm",
  					"c": "text/x-c",
  					"cc": "text/x-c",
  					"cxx": "text/x-c",
  					"cpp": "text/x-c",
  					"h": "text/x-c",
  					"hh": "text/x-c",
  					"dic": "text/x-c",
  					"htc": "text/x-component",
  					"f": "text/x-fortran",
  					"for": "text/x-fortran",
  					"f77": "text/x-fortran",
  					"f90": "text/x-fortran",
  					"hbs": "text/x-handlebars-template",
  					"java": "text/x-java-source",
  					"lua": "text/x-lua",
  					"markdown": "text/x-markdown",
  					"md": "text/x-markdown",
  					"mkd": "text/x-markdown",
  					"nfo": "text/x-nfo",
  					"opml": "text/x-opml",
  					"p": "text/x-pascal",
  					"pas": "text/x-pascal",
  					"pde": "text/x-processing",
  					"sass": "text/x-sass",
  					"scss": "text/x-scss",
  					"etx": "text/x-setext",
  					"sfv": "text/x-sfv",
  					"ymp": "text/x-suse-ymp",
  					"uu": "text/x-uuencode",
  					"vcs": "text/x-vcalendar",
  					"vcf": "text/x-vcard",
  					"yaml": "text/yaml",
  					"yml": "text/yaml",
  					"3gp": "video/3gpp",
  					"3g2": "video/3gpp2",
  					"h261": "video/h261",
  					"h263": "video/h263",
  					"h264": "video/h264",
  					"jpgv": "video/jpeg",
  					"jpm": "video/jpm",
  					"jpgm": "video/jpm",
  					"mj2": "video/mj2",
  					"mjp2": "video/mj2",
  					"ts": "video/mp2t",
  					"mp4": "video/mp4",
  					"mp4v": "video/mp4",
  					"mpg4": "video/mp4",
  					"mpeg": "video/mpeg",
  					"mpg": "video/mpeg",
  					"mpe": "video/mpeg",
  					"m1v": "video/mpeg",
  					"m2v": "video/mpeg",
  					"ogv": "video/ogg",
  					"qt": "video/quicktime",
  					"mov": "video/quicktime",
  					"uvh": "video/vnd.dece.hd",
  					"uvvh": "video/vnd.dece.hd",
  					"uvm": "video/vnd.dece.mobile",
  					"uvvm": "video/vnd.dece.mobile",
  					"uvp": "video/vnd.dece.pd",
  					"uvvp": "video/vnd.dece.pd",
  					"uvs": "video/vnd.dece.sd",
  					"uvvs": "video/vnd.dece.sd",
  					"uvv": "video/vnd.dece.video",
  					"uvvv": "video/vnd.dece.video",
  					"dvb": "video/vnd.dvb.file",
  					"fvt": "video/vnd.fvt",
  					"mxu": "video/vnd.mpegurl",
  					"m4u": "video/vnd.mpegurl",
  					"pyv": "video/vnd.ms-playready.media.pyv",
  					"uvu": "video/vnd.uvvu.mp4",
  					"uvvu": "video/vnd.uvvu.mp4",
  					"viv": "video/vnd.vivo",
  					"webm": "video/webm",
  					"f4v": "video/x-f4v",
  					"fli": "video/x-fli",
  					"flv": "video/x-flv",
  					"m4v": "video/x-m4v",
  					"mkv": "video/x-matroska",
  					"mk3d": "video/x-matroska",
  					"mks": "video/x-matroska",
  					"mng": "video/x-mng",
  					"asf": "video/x-ms-asf",
  					"asx": "video/x-ms-asf",
  					"vob": "video/x-ms-vob",
  					"wm": "video/x-ms-wm",
  					"wmv": "video/x-ms-wmv",
  					"wmx": "video/x-ms-wmx",
  					"wvx": "video/x-ms-wvx",
  					"avi": "video/x-msvideo",
  					"movie": "video/x-sgi-movie",
  					"smv": "video/x-smv",
  					"ice": "x-conference/x-cooltalk"
  				};
  				let mimeOfBuffer;
  				(() => {
  					mimeOfBuffer = function(input) {
  						const buf = new Uint8Array(input);

  						if (!(buf && buf.length > 1))
  							return null;


  						if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
  							return {
  								ext: 'jpg',
  								mime: 'image/jpeg',
  							};
  						}

  						if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
  							return {
  								ext: 'png',
  								mime: 'image/png',
  							};
  						}

  						if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
  							return {
  								ext: 'gif',
  								mime: 'image/gif',
  							};
  						}

  						if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
  							return {
  								ext: 'webp',
  								mime: 'image/webp',
  							};
  						}

  						if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x49 && buf[3] === 0x46) {
  							return {
  								ext: 'flif',
  								mime: 'image/flif',
  							};
  						}

  						// needs to be before `tif` check
  						if (
  							((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) ||
  								(buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)) && buf[8] === 0x43 && buf[9] === 0x52
  						) {
  							return {
  								ext: 'cr2',
  								mime: 'image/x-canon-cr2',
  							};
  						}

  						if (
  							(buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x0) ||
  							(buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x0 && buf[3] === 0x2A)
  						) {
  							return {
  								ext: 'tif',
  								mime: 'image/tiff',
  							};
  						}

  						if (buf[0] === 0x42 && buf[1] === 0x4D) {
  							return {
  								ext: 'bmp',
  								mime: 'image/bmp',
  							};
  						}

  						if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xBC) {
  							return {
  								ext: 'jxr',
  								mime: 'image/vnd.ms-photo',
  							};
  						}

  						if (buf[0] === 0x38 && buf[1] === 0x42 && buf[2] === 0x50 && buf[3] === 0x53) {
  							return {
  								ext: 'psd',
  								mime: 'image/vnd.adobe.photoshop',
  							};
  						}

  						// needs to be before `zip` check
  						if (
  							buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x6D && buf[31] === 0x69 &&
  							buf[32] === 0x6D && buf[33] === 0x65 && buf[34] === 0x74 && buf[35] === 0x79 && buf[36] === 0x70 &&
  							buf[37] === 0x65 && buf[38] === 0x61 && buf[39] === 0x70 && buf[40] === 0x70 && buf[41] === 0x6C &&
  							buf[42] === 0x69 && buf[43] === 0x63 && buf[44] === 0x61 && buf[45] === 0x74 && buf[46] === 0x69 &&
  							buf[47] === 0x6F && buf[48] === 0x6E && buf[49] === 0x2F && buf[50] === 0x65 && buf[51] === 0x70 &&
  							buf[52] === 0x75 && buf[53] === 0x62 && buf[54] === 0x2B && buf[55] === 0x7A && buf[56] === 0x69 &&
  							buf[57] === 0x70
  						) {
  							return {
  								ext: 'epub',
  								mime: 'application/epub+zip',
  							};
  						}

  						// needs to be before `zip` check
  						// assumes signed .xpi from addons.mozilla.org
  						if (
  							buf[0] === 0x50 && buf[1] === 0x4B && buf[2] === 0x3 && buf[3] === 0x4 && buf[30] === 0x4D && buf[31] === 0x45 &&
  							buf[32] === 0x54 && buf[33] === 0x41 && buf[34] === 0x2D && buf[35] === 0x49 && buf[36] === 0x4E &&
  							buf[37] === 0x46 && buf[38] === 0x2F && buf[39] === 0x6D && buf[40] === 0x6F && buf[41] === 0x7A &&
  							buf[42] === 0x69 && buf[43] === 0x6C && buf[44] === 0x6C && buf[45] === 0x61 && buf[46] === 0x2E &&
  							buf[47] === 0x72 && buf[48] === 0x73 && buf[49] === 0x61
  						) {
  							return {
  								ext: 'xpi',
  								mime: 'application/x-xpinstall',
  							};
  						}

  						if (
  							buf[0] === 0x50 && buf[1] === 0x4B && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
  							(buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)
  						) {
  							return {
  								ext: 'zip',
  								mime: 'application/zip',
  							};
  						}

  						if (buf[257] === 0x75 && buf[258] === 0x73 && buf[259] === 0x74 && buf[260] === 0x61 && buf[261] === 0x72) {
  							return {
  								ext: 'tar',
  								mime: 'application/x-tar',
  							};
  						}

  						if (
  							buf[0] === 0x52 && buf[1] === 0x61 && buf[2] === 0x72 && buf[3] === 0x21 && buf[4] === 0x1A && buf[5] === 0x7 &&
  							(buf[6] === 0x0 || buf[6] === 0x1)
  						) {
  							return {
  								ext: 'rar',
  								mime: 'application/x-rar-compressed',
  							};
  						}

  						if (buf[0] === 0x1F && buf[1] === 0x8B && buf[2] === 0x8) {
  							return {
  								ext: 'gz',
  								mime: 'application/gzip',
  							};
  						}

  						if (buf[0] === 0x42 && buf[1] === 0x5A && buf[2] === 0x68) {
  							return {
  								ext: 'bz2',
  								mime: 'application/x-bzip2',
  							};
  						}

  						if (buf[0] === 0x37 && buf[1] === 0x7A && buf[2] === 0xBC && buf[3] === 0xAF && buf[4] === 0x27 && buf[5] === 0x1C) {
  							return {
  								ext: '7z',
  								mime: 'application/x-7z-compressed',
  							};
  						}

  						if (buf[0] === 0x78 && buf[1] === 0x01) {
  							return {
  								ext: 'dmg',
  								mime: 'application/x-apple-diskimage',
  							};
  						}

  						if (
  							(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && (buf[3] === 0x18 || buf[3] === 0x20) && buf[4] === 0x66 &&
  								buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) ||
  							(buf[0] === 0x33 && buf[1] === 0x67 && buf[2] === 0x70 && buf[3] === 0x35) ||
  							(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 &&
  								buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 &&
  								buf[11] === 0x32 && buf[16] === 0x6D && buf[17] === 0x70 && buf[18] === 0x34 && buf[19] === 0x31 &&
  								buf[20] === 0x6D && buf[21] === 0x70 && buf[22] === 0x34 && buf[23] === 0x32 && buf[24] === 0x69 &&
  								buf[25] === 0x73 && buf[26] === 0x6F && buf[27] === 0x6D) ||
  							(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 && buf[5] === 0x74 &&
  								buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x69 && buf[9] === 0x73 && buf[10] === 0x6F &&
  								buf[11] === 0x6D) ||
  							(buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1c && buf[4] === 0x66 && buf[5] === 0x74 &&
  								buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x6D && buf[9] === 0x70 && buf[10] === 0x34 &&
  								buf[11] === 0x32 && buf[12] === 0x0 && buf[13] === 0x0 && buf[14] === 0x0 && buf[15] === 0x0)
  						) {
  							return {
  								ext: 'mp4',
  								mime: 'video/mp4',
  							};
  						}

  						if (
  							buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x1C && buf[4] === 0x66 &&
  							buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D && buf[9] === 0x34 && buf[10] === 0x56
  						) {
  							return {
  								ext: 'm4v',
  								mime: 'video/x-m4v',
  							};
  						}

  						if (buf[0] === 0x4D && buf[1] === 0x54 && buf[2] === 0x68 && buf[3] === 0x64) {
  							return {
  								ext: 'mid',
  								mime: 'audio/midi',
  							};
  						}

  						// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
  						if (buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) {
  							const sliced = buf.subarray(4, 4 + 4096);
  							const idPos = sliced.findIndex((el, i, arr) => arr[i] === 0x42 && arr[i + 1] === 0x82);

  							if (idPos >= 0) {
  								const docTypePos = idPos + 3;
  								const findDocType = (type) => Array.from(type)
  									.every((c, i) => sliced[docTypePos + i] === c.charCodeAt(0));

  								if (findDocType('matroska')) {
  									return {
  										ext: 'mkv',
  										mime: 'video/x-matroska',
  									};
  								}
  								if (findDocType('webm')) {
  									return {
  										ext: 'webm',
  										mime: 'video/webm',
  									};
  								}
  							}
  						}

  						if (
  							buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x0 && buf[3] === 0x14 && buf[4] === 0x66 && buf[5] === 0x74 &&
  							buf[6] === 0x79 && buf[7] === 0x70
  						) {
  							return {
  								ext: 'mov',
  								mime: 'video/quicktime',
  							};
  						}

  						if (
  							buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x41 && buf[9] === 0x56 &&
  							buf[10] === 0x49
  						) {
  							return {
  								ext: 'avi',
  								mime: 'video/x-msvideo',
  							};
  						}

  						if (
  							buf[0] === 0x30 && buf[1] === 0x26 && buf[2] === 0xB2 && buf[3] === 0x75 && buf[4] === 0x8E && buf[5] === 0x66 &&
  							buf[6] === 0xCF && buf[7] === 0x11 && buf[8] === 0xA6 && buf[9] === 0xD9
  						) {
  							return {
  								ext: 'wmv',
  								mime: 'video/x-ms-wmv',
  							};
  						}

  						if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x1 && buf[3].toString(16)[0] === 'b') {
  							return {
  								ext: 'mpg',
  								mime: 'video/mpeg',
  							};
  						}

  						if ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xFF && buf[1] === 0xfb)) {
  							return {
  								ext: 'mp3',
  								mime: 'audio/mpeg',
  							};
  						}

  						if ((buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 && buf[8] === 0x4D &&
  								buf[9] === 0x34 && buf[10] === 0x41) || (buf[0] === 0x4D && buf[1] === 0x34 && buf[2] === 0x41 && buf[3] === 0x20)) {
  							return {
  								ext: 'm4a',
  								mime: 'audio/m4a',
  							};
  						}

  						// needs to be before `ogg` check
  						if (
  							buf[28] === 0x4F && buf[29] === 0x70 && buf[30] === 0x75 && buf[31] === 0x73 && buf[32] === 0x48 &&
  							buf[33] === 0x65 && buf[34] === 0x61 && buf[35] === 0x64
  						) {
  							return {
  								ext: 'opus',
  								mime: 'audio/opus',
  							};
  						}

  						if (buf[0] === 0x4F && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) {
  							return {
  								ext: 'ogg',
  								mime: 'audio/ogg',
  							};
  						}

  						if (buf[0] === 0x66 && buf[1] === 0x4C && buf[2] === 0x61 && buf[3] === 0x43) {
  							return {
  								ext: 'flac',
  								mime: 'audio/x-flac',
  							};
  						}

  						if (
  							buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x41 &&
  							buf[10] === 0x56 && buf[11] === 0x45
  						) {
  							return {
  								ext: 'wav',
  								mime: 'audio/x-wav',
  							};
  						}

  						if (buf[0] === 0x23 && buf[1] === 0x21 && buf[2] === 0x41 && buf[3] === 0x4D && buf[4] === 0x52 && buf[5] === 0x0A) {
  							return {
  								ext: 'amr',
  								mime: 'audio/amr',
  							};
  						}

  						if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
  							return {
  								ext: 'pdf',
  								mime: 'application/pdf',
  							};
  						}

  						if (buf[0] === 0x4D && buf[1] === 0x5A) {
  							return {
  								ext: 'exe',
  								mime: 'application/x-msdownload',
  							};
  						}

  						if ((buf[0] === 0x43 || buf[0] === 0x46) && buf[1] === 0x57 && buf[2] === 0x53) {
  							return {
  								ext: 'swf',
  								mime: 'application/x-shockwave-flash',
  							};
  						}

  						if (buf[0] === 0x7B && buf[1] === 0x5C && buf[2] === 0x72 && buf[3] === 0x74 && buf[4] === 0x66) {
  							return {
  								ext: 'rtf',
  								mime: 'application/rtf',
  							};
  						}

  						if (
  							(buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x46) &&
  							(
  								(buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
  								(buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)
  							)
  						) {
  							return {
  								ext: 'woff',
  								mime: 'application/font-woff',
  							};
  						}

  						if (
  							(buf[0] === 0x77 && buf[1] === 0x4F && buf[2] === 0x46 && buf[3] === 0x32) &&
  							(
  								(buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
  								(buf[4] === 0x4F && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4F)
  							)
  						) {
  							return {
  								ext: 'woff2',
  								mime: 'application/font-woff',
  							};
  						}

  						if (
  							(buf[34] === 0x4C && buf[35] === 0x50) &&
  							(
  								(buf[8] === 0x00 && buf[9] === 0x00 && buf[10] === 0x01) ||
  								(buf[8] === 0x01 && buf[9] === 0x00 && buf[10] === 0x02) ||
  								(buf[8] === 0x02 && buf[9] === 0x00 && buf[10] === 0x02)
  							)
  						) {
  							return {
  								ext: 'eot',
  								mime: 'application/octet-stream',
  							};
  						}

  						if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00 && buf[4] === 0x00) {
  							return {
  								ext: 'ttf',
  								mime: 'application/font-sfnt',
  							};
  						}

  						if (buf[0] === 0x4F && buf[1] === 0x54 && buf[2] === 0x54 && buf[3] === 0x4F && buf[4] === 0x00) {
  							return {
  								ext: 'otf',
  								mime: 'application/font-sfnt',
  							};
  						}

  						if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
  							return {
  								ext: 'ico',
  								mime: 'image/x-icon',
  							};
  						}

  						if (buf[0] === 0x46 && buf[1] === 0x4C && buf[2] === 0x56 && buf[3] === 0x01) {
  							return {
  								ext: 'flv',
  								mime: 'video/x-flv',
  							};
  						}

  						if (buf[0] === 0x25 && buf[1] === 0x21) {
  							return {
  								ext: 'ps',
  								mime: 'application/postscript',
  							};
  						}

  						if (buf[0] === 0xFD && buf[1] === 0x37 && buf[2] === 0x7A && buf[3] === 0x58 && buf[4] === 0x5A && buf[5] === 0x00) {
  							return {
  								ext: 'xz',
  								mime: 'application/x-xz',
  							};
  						}

  						if (buf[0] === 0x53 && buf[1] === 0x51 && buf[2] === 0x4C && buf[3] === 0x69) {
  							return {
  								ext: 'sqlite',
  								mime: 'application/x-sqlite3',
  							};
  						}

  						if (buf[0] === 0x4E && buf[1] === 0x45 && buf[2] === 0x53 && buf[3] === 0x1A) {
  							return {
  								ext: 'nes',
  								mime: 'application/x-nintendo-nes-rom',
  							};
  						}

  						if (buf[0] === 0x43 && buf[1] === 0x72 && buf[2] === 0x32 && buf[3] === 0x34) {
  							return {
  								ext: 'crx',
  								mime: 'application/x-google-chrome-extension',
  							};
  						}

  						if (
  							(buf[0] === 0x4D && buf[1] === 0x53 && buf[2] === 0x43 && buf[3] === 0x46) ||
  							(buf[0] === 0x49 && buf[1] === 0x53 && buf[2] === 0x63 && buf[3] === 0x28)
  						) {
  							return {
  								ext: 'cab',
  								mime: 'application/vnd.ms-cab-compressed',
  							};
  						}

  						// needs to be before `ar` check
  						if (
  							buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 &&
  							buf[6] === 0x3E && buf[7] === 0x0A && buf[8] === 0x64 && buf[9] === 0x65 && buf[10] === 0x62 && buf[11] === 0x69 &&
  							buf[12] === 0x61 && buf[13] === 0x6E && buf[14] === 0x2D && buf[15] === 0x62 && buf[16] === 0x69 &&
  							buf[17] === 0x6E && buf[18] === 0x61 && buf[19] === 0x72 && buf[20] === 0x79
  						) {
  							return {
  								ext: 'deb',
  								mime: 'application/x-deb',
  							};
  						}

  						if (
  							buf[0] === 0x21 && buf[1] === 0x3C && buf[2] === 0x61 && buf[3] === 0x72 && buf[4] === 0x63 && buf[5] === 0x68 &&
  							buf[6] === 0x3E
  						) {
  							return {
  								ext: 'ar',
  								mime: 'application/x-unix-archive',
  							};
  						}

  						if (buf[0] === 0xED && buf[1] === 0xAB && buf[2] === 0xEE && buf[3] === 0xDB) {
  							return {
  								ext: 'rpm',
  								mime: 'application/x-rpm',
  							};
  						}

  						if (
  							(buf[0] === 0x1F && buf[1] === 0xA0) ||
  							(buf[0] === 0x1F && buf[1] === 0x9D)
  						) {
  							return {
  								ext: 'Z',
  								mime: 'application/x-compress',
  							};
  						}

  						if (buf[0] === 0x4C && buf[1] === 0x5A && buf[2] === 0x49 && buf[3] === 0x50) {
  							return {
  								ext: 'lz',
  								mime: 'application/x-lzip',
  							};
  						}

  						if (
  							buf[0] === 0xD0 && buf[1] === 0xCF && buf[2] === 0x11 && buf[3] === 0xE0 && buf[4] === 0xA1 && buf[5] === 0xB1 &&
  							buf[6] === 0x1A && buf[7] === 0xE1
  						) {
  							return {
  								ext: 'msi',
  								mime: 'application/x-msi',
  							};
  						}

  						if (
  							buf[0] === 0x06 && buf[1] === 0x0E && buf[2] === 0x2B && buf[3] === 0x34 && buf[4] === 0x02 && buf[5] === 0x05 &&
  							buf[6] === 0x01 && buf[7] === 0x01 && buf[8] === 0x0D && buf[9] === 0x01 && buf[10] === 0x02 && buf[11] === 0x01 &&
  							buf[12] === 0x01 && buf[13] === 0x02
  						) {
  							return {
  								ext: 'mxf',
  								mime: 'application/mxf',
  							};
  						}

  						return null;
  					}
  				})();

  				function lookupMime(ext) {
  					return mimes[ext.replace(/^\./, '')] || mimes.bin;
  				}

  				function lookupBuffer(buffer) {
  					const ret = mimeOfBuffer(buffer);
  					return ret ? ret.mime : mimes.bin;
  				}

  				mime = {
  					buffer: lookupBuffer,
  					lookup: lookupMime,
  				};
  			})();

  			FormData = class {
  				constructor() {
  					this.boundary = `--snekfetch--${Math.random().toString().slice(2, 7)}`;
  					this.buffers = [];
  				}

  				append(name, data, filename) {
  					if (typeof data === 'undefined') {
  						return;
  					}
  					let str = `\r\n--${this.boundary}\r\nContent-Disposition: form-data; name="${name}"`;
  					let mimetype = null;
  					if (filename) {
  						str += `; filename="${filename}"`;
  						mimetype = 'application/octet-stream';
  						const extname = path.extname(filename)
  							.slice(1);
  						if (extname) {
  							mimetype = mime.lookup(extname);
  						}
  					}

  					if (data instanceof Buffer) {
  						mimetype = mime.buffer(data);
  					} else if (typeof data === 'object') {
  						mimetype = 'application/json';
  						data = Buffer.from(JSON.stringify(data));
  					} else {
  						data = Buffer.from(String(data));
  					}

  					if (mimetype) {
  						str += `\r\nContent-Type: ${mimetype}`;
  					}
  					this.buffers.push(Buffer.from(`${str}\r\n\r\n`));
  					this.buffers.push(data);
  				}

  				getBoundary() {
  					return this.boundary;
  				}

  				end() {
  					return Buffer.concat([...this.buffers, Buffer.from(`\r\n--${this.boundary}--`)]);
  				}

  				get length() {
  					return this.buffers.reduce((sum, b) => sum + Buffer.byteLength(b), 0);
  				}
  			}
  		})();

  		function shouldUnzip(statusCode, headers) {
  			/* istanbul ignore next */
  			if (statusCode === 204 || statusCode === 304) {
  				return false;
  			}
  			if (+headers['content-length'] === 0) {
  				return false;
  			}
  			return /^\s*(?:deflate|gzip)\s*$/.test(headers['content-encoding']);
  		}

  		function request(snek, options = snek.options) {
  			return new Promise(async (resolve, reject) => {
  				Object.assign(options, UrlParse(options.url));

  				let {
  					data
  				} = options;
  				if (data && data.end) {
  					data = data.end();
  				}

  				if (!options.headers['content-length']) {
  					let length = 0;
  					if (data) {
  						try {
  							length = Buffer.byteLength(data);
  						} catch (err) {} // eslint-disable-line no-empty
  					}
  					options.headers['content-length'] = length;
  				}

  				let req;
  				let http2 = false;
  				try {
  					if (options.connection && options.connection.port === options.port &&
  						options.connection.host === options.host) {
  						req = socket.http2req(options.connection, options);
  						http2 = true;
  					} else {
  						const O = await socket(options);
  						({
  							req
  						} = O);
  						if (O.http2) {
  							http2 = true;
  						}
  						if (O.connection) {
  							options.connection = O.connection;
  						}
  					}
  				} catch (err) {
  					reject(err);
  					return;
  				}

  				req.once('error', reject);

  				const body = [];
  				let headers;
  				let statusCode;
  				let statusText;

  				const handleResponse = (stream) => {
  					if (options.redirect === 'follow' && [301, 302, 303, 307, 308].includes(statusCode)) {
  						resolve(request(snek, Object.assign({}, options, {
  							url: UrlResolve(options.url, headers.location),
  						})));
  						if (req.abort) {
  							req.abort();
  						} else if (req.close) {
  							req.close();
  						}
  						return;
  					}

  					stream.once('error', reject);

  					if (shouldUnzip(statusCode, headers)) {
  						stream = stream.pipe(zlib.createUnzip({
  							flush: zlib.Z_SYNC_FLUSH,
  							finishFlush: zlib.Z_SYNC_FLUSH,
  						}));

  						stream.once('error', reject);
  					}

  					stream.on('data', (chunk) => {
  						/* istanbul ignore next */
  						if (!snek.push(chunk)) {
  							snek.pause();
  						}
  						body.push(chunk);
  					});

  					stream.once('end', () => {
  						snek.push(null);
  						const raw = Buffer.concat(body);
  						if (options.connection && options.connection.close) {
  							options.connection.close();
  						}
  						resolve({
  							raw,
  							headers,
  							statusCode,
  							statusText,
  						});
  					});
  				};

  				req.on('response', (res) => {
  					if (!http2) {
  						statusText = res.statusMessage || STATUS_CODES[statusCode];
  						({
  							headers,
  							statusCode
  						} = res);
  						handleResponse(res);
  					} else {
  						statusCode = res[':status'];
  						statusText = STATUS_CODES[statusCode];
  						headers = res;
  						handleResponse(req);
  					}
  				});

  				/* istanbul ignore next */
  				if (data instanceof Stream) {
  					data.pipe(req);
  				} else if (data instanceof Buffer) {
  					req.write(data);
  				} else if (data) {
  					req.write(data);
  				}
  				req.end();
  			});
  		}

  		transport = {
  			request,
  			shouldSendRaw: (data) => data instanceof Buffer || data instanceof Stream,
  			querystring,
  			METHODS,
  			FormData,
  			Parent: Stream.Readable,
  		};
  	})();

  	/**
  	 * Snekfetch
  	 * @extends Stream.Readable
  	 * @extends Promise
  	 */
  	class Snekfetch extends transport.Parent {
  		/**
  		 * Options to pass to the Snekfetch constructor
  		 * @typedef {object} SnekfetchOptions
  		 * @memberof Snekfetch
  		 * @property {object} [headers] Headers to initialize the request with
  		 * @property {object|string|Buffer} [data] Data to initialize the request with
  		 * @property {string|Object} [query] Query to intialize the request with
  		 * @property {boolean} [redirect='follow'] If the request should follow redirects
  		 * @property {object} [qs=querystring] Querystring module to use, any object providing
  		 * `stringify` and `parse` for querystrings
  		 * @property {external:Agent|boolean} [agent] Whether to use an http agent
  		 */

  		/**
  		 * Create a request.
  		 * Usually you'll want to do `Snekfetch#method(url [, options])` instead of
  		 * `new Snekfetch(method, url [, options])`
  		 * @param {string} method HTTP method
  		 * @param {string} url URL
  		 * @param {SnekfetchOptions} [opts] Options
  		 */
  		constructor(method, url, opts = {}) {
  			super();
  			this.options = Object.assign({
  				qs: transport.querystring,
  				method,
  				url,
  				redirect: 'follow',
  			}, opts, {
  				headers: {},
  				query: undefined,
  				data: undefined,
  			});
  			if (opts.headers) {
  				this.set(opts.headers);
  			}
  			if (opts.query) {
  				this.query(opts.query);
  			}
  			if (opts.data) {
  				this.send(opts.data);
  			}
  		}

  		/**
  		 * Add a query param to the request
  		 * @param {string|Object} name Name of query param or object to add to query
  		 * @param {string} [value] If name is a string value, this will be the value of the query param
  		 * @returns {Snekfetch} This request
  		 */
  		query(name, value) {
  			if (this.options.query === undefined) {
  				this.options.query = {};
  			}
  			if (typeof name === 'object') {
  				Object.assign(this.options.query, name);
  			} else {
  				this.options.query[name] = value;
  			}

  			return this;
  		}

  		/**
  		 * Add a header to the request
  		 * @param {string|Object} name Name of query param or object to add to headers
  		 * @param {string} [value] If name is a string value, this will be the value of the header
  		 * @returns {Snekfetch} This request
  		 */
  		set(name, value) {
  			if (typeof name === 'object') {
  				for (const [k, v] of Object.entries(name)) {
  					this.options.headers[k.toLowerCase()] = v;
  				}
  			} else {
  				this.options.headers[name.toLowerCase()] = value;
  			}

  			return this;
  		}

  		/**
  		 * Attach a form data object
  		 * @param {string} name Name of the form attachment
  		 * @param {string|Object|Buffer} data Data for the attachment
  		 * @param {string} [filename] Optional filename if form attachment name needs to be overridden
  		 * @returns {Snekfetch} This request
  		 */
  		attach(...args) {
  			const form = this.options.data instanceof transport.FormData ?
  				this.options.data : this.options.data = new transport.FormData();
  			if (typeof args[0] === 'object') {
  				for (const [k, v] of Object.entries(args[0])) {
  					this.attach(k, v);
  				}
  			} else {
  				form.append(...args);
  			}

  			return this;
  		}

  		/**
  		 * Send data with the request
  		 * @param {string|Buffer|Object} data Data to send
  		 * @returns {Snekfetch} This request
  		 */
  		send(data) {
  			if (data instanceof transport.FormData || transport.shouldSendRaw(data)) {
  				this.options.data = data;
  			} else if (data !== null && typeof data === 'object') {
  				const header = this.options.headers['content-type'];
  				let serialize;
  				if (header) {
  					if (header.includes('application/json')) {
  						serialize = JSON.stringify;
  					} else if (header.includes('urlencoded')) {
  						serialize = this.options.qs.stringify;
  					}
  				} else {
  					this.set('Content-Type', 'application/json');
  					serialize = JSON.stringify;
  				}
  				this.options.data = serialize(data);
  			} else {
  				this.options.data = data;
  			}
  			return this;
  		}

  		then(resolver, rejector) {
  			if (this._response) {
  				return this._response.then(resolver, rejector);
  			}
  			this._finalizeRequest();
  			// eslint-disable-next-line no-return-assign
  			return this._response = transport.request(this)
  				.then(({
  					raw,
  					headers,
  					statusCode,
  					statusText
  				}) => {
  					// forgive me :(
  					const self = this; // eslint-disable-line consistent-this
  					/**
  					 * Response from Snekfetch
  					 * @typedef {Object} SnekfetchResponse
  					 * @memberof Snekfetch
  					 * @prop {HTTP.Request} request
  					 * @prop {?string|object|Buffer} body Processed response body
  					 * @prop {Buffer} raw Raw response body
  					 * @prop {boolean} ok If the response code is >= 200 and < 300
  					 * @prop {number} statusCode HTTP status code
  					 * @prop {string} statusText Human readable HTTP status
  					 */
  					const res = {
  						request: this.request,
  						get body() {
  							delete res.body;
  							const type = res.headers['content-type'];
  							if (raw instanceof ArrayBuffer) {
  								raw = new window.TextDecoder('utf8')
  									.decode(raw); // eslint-disable-line no-undef
  							}
  							if (/application\/json/.test(type)) {
  								try {
  									res.body = JSON.parse(raw);
  								} catch (err) {
  									res.body = String(raw);
  								}
  							} else if (/application\/x-www-form-urlencoded/.test(type)) {
  								res.body = self.options.qs.parse(String(raw));
  							} else {
  								res.body = raw;
  							}
  							return res.body;
  						},
  						raw,
  						ok: statusCode >= 200 && statusCode < 400,
  						headers,
  						statusCode,
  						statusText,
  					};

  					if (res.ok) {
  						return res;
  					}
  					const err = new Error(`${statusCode} ${statusText}`.trim());
  					Object.assign(err, res);
  					return Promise.reject(err);
  				})
  				.then(resolver, rejector);
  		}

  		catch (rejector) {
  			return this.then(null, rejector);
  		}

  		/**
  		 * End the request
  		 * @param {Function} [cb] Optional callback to handle the response
  		 * @returns {Promise} This request
  		 */
  		end(cb) {
  			return this.then(
  				(res) => (cb ? cb(null, res) : res),
  				(err) => (cb ? cb(err, err.statusCode ? err : null) : Promise.reject(err))
  			);
  		}

  		_finalizeRequest() {
  			if (this.options.method !== 'HEAD') {
  				this.set('Accept-Encoding', 'gzip, deflate');
  			}
  			if (this.options.data && this.options.data.getBoundary) {
  				this.set('Content-Type', `multipart/form-data; boundary=${this.options.data.getBoundary()}`);
  			}

  			if (this.options.query) {
  				const [url, query] = this.options.url.split('?');
  				this.options.url = `${url}?${this.options.qs.stringify(this.options.query)}${query ? `&${query}` : ''}`;
  			}
  		}

  		_read() {
  			this.resume();
  			if (this._response) {
  				return;
  			}
  			this.catch((err) => this.emit('error', err));
  		}
  	}

  	/**
  	 * Create a ((THIS)) request
  	 * @dynamic this.METHODS
  	 * @method Snekfetch.((THIS)lowerCase)
  	 * @param {string} url The url to request
  	 * @param {Snekfetch.snekfetchOptions} [opts] Options
  	 * @returns {Snekfetch}
  	 */
  	Snekfetch.METHODS = transport.METHODS.filter((m) => m !== 'M-SEARCH');
  	for (const method of Snekfetch.METHODS) {
  		Snekfetch[method.toLowerCase()] = function runMethod(url, opts) {
  			const Constructor = this && this.prototype instanceof Snekfetch ? this : Snekfetch;
  			return new Constructor(method, url, opts);
  		};
  	}

  	snekfetch = Snekfetch;
  })();

  // discordjs Snowflake
  let Snowflake;
  (() => {
  	/*
  	  Apache License
  	  Version 2.0, January 2004
  	  http://www.apache.org/licenses/

  	  TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

  	  1. Definitions.

  	  "License" shall mean the terms and conditions for use, reproduction,
  	  and distribution as defined by Sections 1 through 9 of this document.

  	  "Licensor" shall mean the copyright owner or entity authorized by
  	  the copyright owner that is granting the License.

  	  "Legal Entity" shall mean the union of the acting entity and all
  	  other entities that control, are controlled by, or are under common
  	  control with that entity. For the purposes of this definition,
  	  "control" means (i) the power, direct or indirect, to cause the
  	  direction or management of such entity, whether by contract or
  	  otherwise, or (ii) ownership of fifty percent (50%) or more of the
  	  outstanding shares, or (iii) beneficial ownership of such entity.

  	  "You" (or "Your") shall mean an individual or Legal Entity
  	  exercising permissions granted by this License.

  	  "Source" form shall mean the preferred form for making modifications,
  	  including but not limited to software source code, documentation
  	  source, and configuration files.

  	  "Object" form shall mean any form resulting from mechanical
  	  transformation or translation of a Source form, including but
  	  not limited to compiled object code, generated documentation,
  	  and conversions to other media types.

  	  "Work" shall mean the work of authorship, whether in Source or
  	  Object form, made available under the License, as indicated by a
  	  copyright notice that is included in or attached to the work
  	  (an example is provided in the Appendix below).

  	  "Derivative Works" shall mean any work, whether in Source or Object
  	  form, that is based on (or derived from) the Work and for which the
  	  editorial revisions, annotations, elaborations, or other modifications
  	  represent, as a whole, an original work of authorship. For the purposes
  	  of this License, Derivative Works shall not include works that remain
  	  separable from, or merely link (or bind by name) to the interfaces of,
  	  the Work and Derivative Works thereof.

  	  "Contribution" shall mean any work of authorship, including
  	  the original version of the Work and any modifications or additions
  	  to that Work or Derivative Works thereof, that is intentionally
  	  submitted to Licensor for inclusion in the Work by the copyright owner
  	  or by an individual or Legal Entity authorized to submit on behalf of
  	  the copyright owner. For the purposes of this definition, "submitted"
  	  means any form of electronic, verbal, or written communication sent
  	  to the Licensor or its representatives, including but not limited to
  	  communication on electronic mailing lists, source code control systems,
  	  and issue tracking systems that are managed by, or on behalf of, the
  	  Licensor for the purpose of discussing and improving the Work, but
  	  excluding communication that is conspicuously marked or otherwise
  	  designated in writing by the copyright owner as "Not a Contribution."

  	  "Contributor" shall mean Licensor and any individual or Legal Entity
  	  on behalf of whom a Contribution has been received by Licensor and
  	  subsequently incorporated within the Work.

  	  2. Grant of Copyright License. Subject to the terms and conditions of
  	  this License, each Contributor hereby grants to You a perpetual,
  	  worldwide, non-exclusive, no-charge, royalty-free, irrevocable
  	  copyright license to reproduce, prepare Derivative Works of,
  	  publicly display, publicly perform, sublicense, and distribute the
  	  Work and such Derivative Works in Source or Object form.

  	  3. Grant of Patent License. Subject to the terms and conditions of
  	  this License, each Contributor hereby grants to You a perpetual,
  	  worldwide, non-exclusive, no-charge, royalty-free, irrevocable
  	  (except as stated in this section) patent license to make, have made,
  	  use, offer to sell, sell, import, and otherwise transfer the Work,
  	  where such license applies only to those patent claims licensable
  	  by such Contributor that are necessarily infringed by their
  	  Contribution(s) alone or by combination of their Contribution(s)
  	  with the Work to which such Contribution(s) was submitted. If You
  	  institute patent litigation against any entity (including a
  	  cross-claim or counterclaim in a lawsuit) alleging that the Work
  	  or a Contribution incorporated within the Work constitutes direct
  	  or contributory patent infringement, then any patent licenses
  	  granted to You under this License for that Work shall terminate
  	  as of the date such litigation is filed.

  	  4. Redistribution. You may reproduce and distribute copies of the
  	  Work or Derivative Works thereof in any medium, with or without
  	  modifications, and in Source or Object form, provided that You
  	  meet the following conditions:

  	  (a) You must give any other recipients of the Work or
  	  Derivative Works a copy of this License; and

  	  (b) You must cause any modified files to carry prominent notices
  	  stating that You changed the files; and

  	  (c) You must retain, in the Source form of any Derivative Works
  	  that You distribute, all copyright, patent, trademark, and
  	  attribution notices from the Source form of the Work,
  	  excluding those notices that do not pertain to any part of
  	  the Derivative Works; and

  	  (d) If the Work includes a "NOTICE" text file as part of its
  	  distribution, then any Derivative Works that You distribute must
  	  include a readable copy of the attribution notices contained
  	  within such NOTICE file, excluding those notices that do not
  	  pertain to any part of the Derivative Works, in at least one
  	  of the following places: within a NOTICE text file distributed
  	  as part of the Derivative Works; within the Source form or
  	  documentation, if provided along with the Derivative Works; or,
  	  within a display generated by the Derivative Works, if and
  	  wherever such third-party notices normally appear. The contents
  	  of the NOTICE file are for informational purposes only and
  	  do not modify the License. You may add Your own attribution
  	  notices within Derivative Works that You distribute, alongside
  	  or as an addendum to the NOTICE text from the Work, provided
  	  that such additional attribution notices cannot be construed
  	  as modifying the License.

  	  You may add Your own copyright statement to Your modifications and
  	  may provide additional or different license terms and conditions
  	  for use, reproduction, or distribution of Your modifications, or
  	  for any such Derivative Works as a whole, provided Your use,
  	  reproduction, and distribution of the Work otherwise complies with
  	  the conditions stated in this License.

  	  5. Submission of Contributions. Unless You explicitly state otherwise,
  	  any Contribution intentionally submitted for inclusion in the Work
  	  by You to the Licensor shall be under the terms and conditions of
  	  this License, without any additional terms or conditions.
  	  Notwithstanding the above, nothing herein shall supersede or modify
  	  the terms of any separate license agreement you may have executed
  	  with Licensor regarding such Contributions.

  	  6. Trademarks. This License does not grant permission to use the trade
  	  names, trademarks, service marks, or product names of the Licensor,
  	  except as required for reasonable and customary use in describing the
  	  origin of the Work and reproducing the content of the NOTICE file.

  	  7. Disclaimer of Warranty. Unless required by applicable law or
  	  agreed to in writing, Licensor provides the Work (and each
  	  Contributor provides its Contributions) on an "AS IS" BASIS,
  	  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  	  implied, including, without limitation, any warranties or conditions
  	  of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
  	  PARTICULAR PURPOSE. You are solely responsible for determining the
  	  appropriateness of using or redistributing the Work and assume any
  	  risks associated with Your exercise of permissions under this License.

  	  8. Limitation of Liability. In no event and under no legal theory,
  	  whether in tort (including negligence), contract, or otherwise,
  	  unless required by applicable law (such as deliberate and grossly
  	  negligent acts) or agreed to in writing, shall any Contributor be
  	  liable to You for damages, including any direct, indirect, special,
  	  incidental, or consequential damages of any character arising as a
  	  result of this License or out of the use or inability to use the
  	  Work (including but not limited to damages for loss of goodwill,
  	  work stoppage, computer failure or malfunction, or any and all
  	  other commercial damages or losses), even if such Contributor
  	  has been advised of the possibility of such damages.

  	  9. Accepting Warranty or Additional Liability. While redistributing
  	  the Work or Derivative Works thereof, You may choose to offer,
  	  and charge a fee for, acceptance of support, warranty, indemnity,
  	  or other liability obligations and/or rights consistent with this
  	  License. However, in accepting such obligations, You may act only
  	  on Your own behalf and on Your sole responsibility, not on behalf
  	  of any other Contributor, and only if You agree to indemnify,
  	  defend, and hold each Contributor harmless for any liability
  	  incurred by, or claims asserted against, such Contributor by reason
  	  of your accepting any such warranty or additional liability.

  	  END OF TERMS AND CONDITIONS

  	  Copyright 2015 - 2018 Amish Shah

  	  Licensed under the Apache License, Version 2.0 (the "License");
  	  you may not use this file except in compliance with the License.
  	  You may obtain a copy of the License at

  	  http://www.apache.org/licenses/LICENSE-2.0

  	  Unless required by applicable law or agreed to in writing, software
  	  distributed under the License is distributed on an "AS IS" BASIS,
  	  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  	  See the License for the specific language governing permissions and
  	  limitations under the License.
  	*/
  	// Modified by including only the stuff needed for discord-rpc
  	// discordjs Util
  	const Util = {
  		binaryToID: function binaryToID(num) {
  			let dec = '';

  			while (num.length > 50) {
  				const high = parseInt(num.slice(0, -32), 2);
  				const low = parseInt((high % 10)
  					.toString(2) + num.slice(-32), 2);

  				dec = (low % 10)
  					.toString() + dec;
  				num = Math.floor(high / 10)
  					.toString(2) + Math.floor(low / 10)
  					.toString(2)
  					.padStart(32, '0');
  			}

  			num = parseInt(num, 2);
  			while (num > 0) {
  				dec = (num % 10)
  					.toString() + dec;
  				num = Math.floor(num / 10);
  			}

  			return dec;
  		},
  		idToBinary: function idToBinary(num) {
  			let bin = '';
  			let high = parseInt(num.slice(0, -10)) || 0;
  			let low = parseInt(num.slice(-10));
  			while (low > 0 || high > 0) {
  				bin = String(low & 1) + bin;
  				low = Math.floor(low / 2);
  				if (high > 0) {
  					low += 5000000000 * (high % 2);
  					high = Math.floor(high / 2);
  				}
  			}
  			return bin;
  		}
  	};

  	// Discord epoch (2015-01-01T00:00:00.000Z)
  	const EPOCH = 1420070400000;
  	let INCREMENT = 0;

  	/**
  	 * A container for useful snowflake-related methods.
  	 */
  	class SnowflakeUtil {
  		constructor() {
  			throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  		}

  		/**
  		 * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
  		 * ```
  		 * If we have a snowflake '266241948824764416' we can represent it as binary:
  		 *
  		 * 64                                          22     17     12          0
  		 *  000000111011000111100001101001000101000000  00001  00000  000000000000
  		 *       number of ms since Discord epoch       worker  pid    increment
  		 * ```
  		 * @typedef {string} Snowflake
  		 */

  		/**
  		 * Generates a Discord snowflake.
  		 * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
  		 * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
  		 * @returns {Snowflake} The generated snowflake
  		 */
  		static generate(timestamp = Date.now()) {
  			if (timestamp instanceof Date) timestamp = timestamp.getTime();
  			if (typeof timestamp !== 'number' || isNaN(timestamp)) {
  				throw new TypeError(
  					`"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`
  				);
  			}
  			if (INCREMENT >= 4095) INCREMENT = 0;
  			// eslint-disable-next-line max-len
  			const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++).toString(2).padStart(12, '0')}`;
  			return Util.binaryToID(BINARY);
  		}

  		/**
  		 * A deconstructed snowflake.
  		 * @typedef {Object} DeconstructedSnowflake
  		 * @property {number} timestamp Timestamp the snowflake was created
  		 * @property {Date} date Date the snowflake was created
  		 * @property {number} workerID Worker ID in the snowflake
  		 * @property {number} processID Process ID in the snowflake
  		 * @property {number} increment Increment in the snowflake
  		 * @property {string} binary Binary representation of the snowflake
  		 */

  		/**
  		 * Deconstructs a Discord snowflake.
  		 * @param {Snowflake} snowflake Snowflake to deconstruct
  		 * @returns {DeconstructedSnowflake} Deconstructed snowflake
  		 */
  		static deconstruct(snowflake) {
  			const BINARY = Util.idToBinary(snowflake)
  				.toString(2)
  				.padStart(64, '0');
  			const res = {
  				timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
  				workerID: parseInt(BINARY.substring(42, 47), 2),
  				processID: parseInt(BINARY.substring(47, 52), 2),
  				increment: parseInt(BINARY.substring(52, 64), 2),
  				binary: BINARY,
  			};
  			Object.defineProperty(res, 'date', {
  				get: function get() {
  					return new Date(this.timestamp);
  				},
  				enumerable: true,
  			});
  			return res;
  		}
  	}

  	Snowflake = SnowflakeUtil;
  })();

  // discordjs/RPC library
  // Old version modified to add support for buttons
  let RPCClient;
  (() => {
  	// https://github.com/discordjs/RPC
  	const {
  		setTimeout,
  		clearTimeout
  	} = require('timers');
  	const request = snekfetch;
  	let transports;
  	(() => {
  		const net = require('net');
  		const EventEmitter = require('events');
  		const request = snekfetch;

  		const OPCodes = {
  			HANDSHAKE: 0,
  			FRAME: 1,
  			CLOSE: 2,
  			PING: 3,
  			PONG: 4,
  		};

  		class IPCTransport extends EventEmitter {
  			constructor(client) {
  				super();
  				this.client = client;
  				this.socket = null;
  			}

  			async connect({
  				client_id
  			}) {
  				const socket = this.socket = await getIPC();
  				this.emit('open');
  				socket.write(encode(OPCodes.HANDSHAKE, {
  					v: 1,
  					client_id,
  				}));
  				socket.pause();
  				socket.on('readable', () => {
  					decode(socket, ({
  						op,
  						data
  					}) => {
  						switch (op) {
  							case OPCodes.PING:
  								this.send(data, OPCodes.PONG);
  								break;
  							case OPCodes.FRAME:
  								if (!data) {
  									return;
  								}
  								if (data.cmd === 'AUTHORIZE' && data.evt !== 'ERROR') {
  									findEndpoint()
  										.then((endpoint) => {
  											this.client.rest.endpoint = endpoint;
  											this.client.rest.versioned = false;
  										});
  								}
  								this.emit('message', data);
  								break;
  							case OPCodes.CLOSE:
  								this.emit('close', data);
  								break;
  							default:
  								break;
  						}
  					});
  				});
  				socket.on('close', this.onClose.bind(this));
  				socket.on('error', this.onClose.bind(this));
  			}

  			onClose(e) {
  				this.emit('close', e);
  			}

  			send(data, op = OPCodes.FRAME) {
  				this.socket.write(encode(op, data));
  			}

  			close() {
  				this.send({}, OPCodes.CLOSE);
  				this.socket.end();
  			}

  			ping() {
  				this.send(Snowflake.generate(), OPCodes.PING);
  			}
  		}

  		function encode(op, data) {
  			data = JSON.stringify(data);
  			const len = Buffer.byteLength(data);
  			const packet = Buffer.alloc(8 + len);
  			packet.writeInt32LE(op, 0);
  			packet.writeInt32LE(len, 4);
  			packet.write(data, 8, len);
  			return packet;
  		}

  		const working = {
  			full: '',
  			op: undefined,
  		};

  		function decode(socket, callback) {
  			const packet = socket.read();
  			if (!packet) {
  				return;
  			}

  			let op = working.op;
  			let raw;
  			if (working.full === '') {
  				op = working.op = packet.readInt32LE(0);
  				const len = packet.readInt32LE(4);
  				raw = packet.slice(8, len + 8);
  			} else {
  				raw = packet.toString();
  			}

  			try {
  				const data = JSON.parse(working.full + raw);
  				callback({
  					op,
  					data
  				}); // eslint-disable-line callback-return
  				working.full = '';
  				working.op = undefined;
  			} catch (err) {
  				working.full += raw;
  			}

  			decode(socket, callback);
  		}

  		function getIPCPath(id) {
  			if (process.platform === 'win32') {
  				return `\\\\?\\pipe\\discord-ipc-${id}`;
  			}
  			const {
  				env: {
  					XDG_RUNTIME_DIR,
  					TMPDIR,
  					TMP,
  					TEMP
  				}
  			} = process;
  			const prefix = XDG_RUNTIME_DIR || TMPDIR || TMP || TEMP || '/tmp';
  			return `${prefix.replace(/\/$/, '')}/discord-ipc-${id}`;
  		}

  		function getIPC(id = 0) {
  			return new Promise((resolve, reject) => {
  				const path = getIPCPath(id);
  				const onerror = () => {
  					if (id < 10) {
  						resolve(getIPC(id + 1));
  					} else {
  						reject(new Error('Could not connect'));
  					}
  				};
  				const sock = net.createConnection(path, () => {
  					sock.removeListener('error', onerror);
  					resolve(sock);
  				});
  				sock.once('error', onerror);
  			});
  		}

  		function findEndpoint(tries = 0) {
  			if (tries > 30) {
  				throw new Error('Could not find endpoint');
  			}
  			const endpoint = `http://127.0.0.1:${6463 + (tries % 10)}`;
  			return request.get(endpoint)
  				.end((err, res) => {
  					if ((err.status || res.status) === 401) {
  						return endpoint;
  					}
  					return findEndpoint(tries + 1);
  				});
  		}

  		transports = {};
  		transports.ipc = IPCTransport;
  		transports.ipc.encode = encode;
  		transports.ipc.decode = decode;
  	})();

  	function getPid() {
  		if (typeof process !== undefined) {
  			return process.pid;
  		}
  		return null;
  	}
  	/**
  	 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
  	 */
  	class Base {
  		constructor(client) {
  			/**
  			 * The client that instantiated this
  			 * @name Base#client
  			 * @type {Client}
  			 * @readonly
  			 */
  			Object.defineProperty(this, 'client', {
  				value: client
  			});
  		}

  		_clone() {
  			return Object.assign(Object.create(this), this);
  		}

  		_patch(data) {
  			return data;
  		}

  		_update(data) {
  			const clone = this._clone();
  			this._patch(data);
  			return clone;
  		}

  		toJSON(...props) {
  			return flatten(this, ...props);
  		}

  		valueOf() {
  			return this.id;
  		}
  	}
  	let ClientApplication;
  	(() => {
  		const ClientApplicationAssetTypes = {
  			SMALL: 1,
  			BIG: 2,
  		};

  		function makeImageUrl(root, {
  			format = 'webp',
  			size
  		} = {}) {
  			if (format && !AllowedImageFormats.includes(format)) throw new Error('IMAGE_FORMAT', format);
  			if (size && !AllowedImageSizes.includes(size)) throw new RangeError('IMAGE_SIZE', size);
  			return `${root}.${format}${size ? `?size=${size}` : ''}`;
  		}
  		const Endpoints = {
  			CDN(root) {
  				return {
  					Emoji: (emojiID, format = 'png') => `${root}/emojis/${emojiID}.${format}`,
  					Asset: name => `${root}/assets/${name}`,
  					DefaultAvatar: number => `${root}/embed/avatars/${number}.png`,
  					Avatar: (userID, hash, format = 'default', size) => {
  						if (userID === '1') return hash;
  						if (format === 'default') format = hash.startsWith('a_') ? 'gif' : 'webp';
  						return makeImageUrl(`${root}/avatars/${userID}/${hash}`, {
  							format,
  							size
  						});
  					},
  					Icon: (guildID, hash, format = 'webp', size) =>
  						makeImageUrl(`${root}/icons/${guildID}/${hash}`, {
  							format,
  							size
  						}),
  					AppIcon: (clientID, hash, {
  							format = 'webp',
  							size
  						} = {}) =>
  						makeImageUrl(`${root}/app-icons/${clientID}/${hash}`, {
  							size,
  							format
  						}),
  					AppAsset: (clientID, hash, {
  							format = 'webp',
  							size
  						} = {}) =>
  						makeImageUrl(`${root}/app-assets/${clientID}/${hash}`, {
  							size,
  							format
  						}),
  					GDMIcon: (channelID, hash, format = 'webp', size) =>
  						makeImageUrl(`${root}/channel-icons/${channelID}/${hash}`, {
  							size,
  							format
  						}),
  					Splash: (guildID, hash, format = 'webp', size) =>
  						makeImageUrl(`${root}/splashes/${guildID}/${hash}`, {
  							size,
  							format
  						}),
  				};
  			},
  			invite: (root, code) => `${root}/${code}`,
  			botGateway: '/gateway/bot'
  		};
  		const DataResolver = {
  			resolveImage: async function(image) {
  				if (!image) return null;
  				if (typeof image === 'string' && image.startsWith('data:')) {
  					return image;
  				}
  				const file = await DataResolver.resolveFile(image);
  				return DataResolver.resolveBase64(file);
  			},
  			resolveFile: function(resource) {
  				if (resource instanceof Buffer) return Promise.resolve(resource);
  				if (browser && resource instanceof ArrayBuffer) return Promise.resolve(Buffer.from(resource));

  				if (typeof resource === 'string') {
  					if (/^https?:\/\//.test(resource)) {
  						return snekfetch.get(resource)
  							.then(res => res.body instanceof Buffer ? res.body : Buffer.from(res.text));
  					} else {
  						return new Promise((resolve, reject) => {
  							const file = browser ? resource : path.resolve(resource);
  							fs.stat(file, (err, stats) => {
  								if (err) return reject(err);
  								if (!stats || !stats.isFile()) return reject(new DiscordError('FILE_NOT_FOUND', file));
  								fs.readFile(file, (err2, data) => {
  									if (err2) reject(err2);
  									else resolve(data);
  								});
  								return null;
  							});
  						});
  					}
  				} else if (resource.pipe && typeof resource.pipe === 'function') {
  					return new Promise((resolve, reject) => {
  						const buffers = [];
  						resource.once('error', reject);
  						resource.on('data', data => buffers.push(data));
  						resource.once('end', () => resolve(Buffer.concat(buffers)));
  					});
  				}
  				return Promise.reject(new TypeError('REQ_RESOURCE_TYPE'));
  			},
  			resolveBase64: function(data) {
  				if (data instanceof Buffer) return `data:image/jpg;base64,${data.toString('base64')}`;
  				return data;
  			}
  		};

  		function flatten(obj, ...props) {
  			const isObject = d => typeof d === 'object' && d !== null;
  			if (!isObject(obj)) return obj;

  			props = Object.assign(...Object.keys(obj)
  				.filter(k => !k.startsWith('_'))
  				.map(k => ({
  					[k]: true
  				})), ...props);

  			const out = {};

  			for (let [prop, newProp] of Object.entries(props)) {
  				if (!newProp) continue;
  				newProp = newProp === true ? prop : newProp;

  				const element = obj[prop];
  				const elemIsObj = isObject(element);
  				const valueOf = elemIsObj && typeof element.valueOf === 'function' ? element.valueOf() : null;

  				// If it's an array, flatten each element
  				if (Array.isArray(element)) out[newProp] = element.map(e => flatten(e));
  				// If it's an object with a primitive `valueOf`, use that value
  				else if (valueOf && !isObject(valueOf)) out[newProp] = valueOf;
  				// If it's a primitive
  				else if (!elemIsObj) out[newProp] = element;
  			}

  			return out;
  		}

  		/**
  		 * Represents a Client OAuth2 Application.
  		 * @extends {Base}
  		 */
  		ClientApplication = class extends Base {
  			constructor(client, data) {
  				super(client);
  				this._patch(data);
  			}

  			_patch(data) {
  				/**
  				 * The ID of the app
  				 * @type {Snowflake}
  				 */
  				this.id = data.id;

  				/**
  				 * The name of the app
  				 * @type {string}
  				 */
  				this.name = data.name;

  				/**
  				 * The app's description
  				 * @type {string}
  				 */
  				this.description = data.description;

  				/**
  				 * The app's icon hash
  				 * @type {string}
  				 */
  				this.icon = data.icon;

  				/**
  				 * The app's cover image hash
  				 * @type {?string}
  				 */
  				this.cover = data.cover_image;

  				/**
  				 * The app's RPC origins
  				 * @type {?string[]}
  				 */
  				this.rpcOrigins = data.rpc_origins;

  				/**
  				 * The app's redirect URIs
  				 * @type {string[]}
  				 */
  				this.redirectURIs = data.redirect_uris;

  				/**
  				 * If this app's bot requires a code grant when using the OAuth2 flow
  				 * @type {boolean}
  				 */
  				this.botRequireCodeGrant = data.bot_require_code_grant;

  				/**
  				 * If this app's bot is public
  				 * @type {boolean}
  				 */
  				this.botPublic = data.bot_public;

  				/**
  				 * If this app can use rpc
  				 * @type {boolean}
  				 */
  				this.rpcApplicationState = data.rpc_application_state;

  				/**
  				 * Object containing basic info about this app's bot
  				 * @type {Object}
  				 */
  				this.bot = data.bot;

  				/**
  				 * The flags for the app
  				 * @type {number}
  				 */
  				this.flags = data.flags;

  				/**
  				 * OAuth2 secret for the application
  				 * @type {string}
  				 */
  				this.secret = data.secret;

  				if (data.owner) {
  					/**
  					 * The owner of this OAuth application
  					 * @type {?User}
  					 */
  					this.owner = this.client.users.add(data.owner);
  				}
  			}

  			/**
  			 * The timestamp the app was created at
  			 * @type {number}
  			 * @readonly
  			 */
  			get createdTimestamp() {
  				return Snowflake.deconstruct(this.id)
  					.timestamp;
  			}

  			/**
  			 * The time the app was created at
  			 * @type {Date}
  			 * @readonly
  			 */
  			get createdAt() {
  				return new Date(this.createdTimestamp);
  			}

  			/**
  			 * A link to the application's icon.
  			 * @param {Object} [options={}] Options for the icon url
  			 * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
  			 * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
  			 * @returns {?string} URL to the icon
  			 */
  			iconURL({
  				format,
  				size
  			} = {}) {
  				if (!this.icon) return null;
  				return this.client.rest.cdn.AppIcon(this.id, this.icon, {
  					format,
  					size
  				});
  			}

  			/**
  			 * A link to this application's cover image.
  			 * @param {Object} [options={}] Options for the cover image url
  			 * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
  			 * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
  			 * @returns {?string} URL to the cover image
  			 */
  			coverImage({
  				format,
  				size
  			} = {}) {
  				if (!this.cover) return null;
  				return Endpoints
  					.CDN(this.client.options.http.cdn)
  					.AppIcon(this.id, this.cover, {
  						format,
  						size
  					});
  			}

  			/**
  			 * Get rich presence assets.
  			 * @returns {Promise<Object>}
  			 */
  			fetchAssets() {
  				const types = Object.keys(ClientApplicationAssetTypes);
  				return this.client.api.oauth2.applications(this.id)
  					.assets.get()
  					.then(assets => assets.map(a => ({
  						id: a.id,
  						name: a.name,
  						type: types[a.type - 1],
  					})));
  			}

  			/**
  			 * Creates a rich presence asset.
  			 * @param {string} name Name of the asset
  			 * @param {Base64Resolvable} data Data of the asset
  			 * @param {string} type Type of the asset. `big`, or `small`
  			 * @returns {Promise}
  			 */
  			async createAsset(name, data, type) {
  				return this.client.api.oauth2.applications(this.id)
  					.assets.post({
  						data: {
  							name,
  							type: ClientApplicationAssetTypes[type.toUpperCase()],
  							image: await DataResolver.resolveImage(data),
  						}
  					});
  			}

  			/**
  			 * Resets the app's secret.
  			 * <warn>This is only available when using a user account.</warn>
  			 * @returns {Promise<ClientApplication>}
  			 */
  			resetSecret() {
  				return this.client.api.oauth2.applications[this.id].reset.post()
  					.then(app => new ClientApplication(this.client, app));
  			}

  			/**
  			 * Resets the app's bot token.
  			 * <warn>This is only available when using a user account.</warn>
  			 * @returns {Promise<ClientApplication>}
  			 */
  			resetToken() {
  				return this.client.api.oauth2.applications[this.id].bot.reset.post()
  					.then(app => new ClientApplication(this.client, Object.assign({}, this, {
  						bot: app
  					})));
  			}

  			/**
  			 * When concatenated with a string, this automatically returns the application's name instead of the
  			 * ClientApplication object.
  			 * @returns {string}
  			 * @example
  			 * // Logs: Application name: My App
  			 * console.log(`Application name: ${application}`);
  			 */
  			toString() {
  				return this.name;
  			}

  			toJSON() {
  				return super.toJSON({
  					createdTimestamp: true
  				});
  			}
  		};
  	})();
  	/**
  	 * The base class for all clients.
  	 * @extends {EventEmitter}
  	 */
  	class BaseClient extends EventEmitter {
  		constructor(options = {}) {
  			super();

  			/**
  			 * Timeouts set by {@link BaseClient#setTimeout} that are still active
  			 * @type {Set<Timeout>}
  			 * @private
  			 */
  			this._timeouts = new Set();

  			/**
  			 * Intervals set by {@link BaseClient#setInterval} that are still active
  			 * @type {Set<Timeout>}
  			 * @private
  			 */
  			this._intervals = new Set();

  			/**
  			 * The options the client was instantiated with
  			 * @type {ClientOptions}
  			 */
  			this.options = {}; // Util.mergeDefault(DefaultOptions, options);

  			/**
  			 * The REST manager of the client
  			 * @type {RESTManager}
  			 * @private
  			 */
  			//this.rest = new RESTManager(this, options._tokenType);
  		}

  		/**
  		 * API shortcut
  		 * @type {Object}
  		 * @readonly
  		 * @private
  		 */
  		get api() {
  			return this.rest.api;
  		}

  		/**
  		 * Destroys all assets used by the base client.
  		 */
  		destroy() {
  			for (const t of this._timeouts) clearTimeout(t);
  			for (const i of this._intervals) clearInterval(i);
  			this._timeouts.clear();
  			this._intervals.clear();
  		}

  		/**
  		 * Sets a timeout that will be automatically cancelled if the client is destroyed.
  		 * @param {Function} fn Function to execute
  		 * @param {number} delay Time to wait before executing (in milliseconds)
  		 * @param {...*} args Arguments for the function
  		 * @returns {Timeout}
  		 */
  		setTimeout(fn, delay, ...args) {
  			const timeout = setTimeout(() => {
  				fn(...args);
  				this._timeouts.delete(timeout);
  			}, delay);
  			this._timeouts.add(timeout);
  			return timeout;
  		}

  		/**
  		 * Clears a timeout.
  		 * @param {Timeout} timeout Timeout to cancel
  		 */
  		clearTimeout(timeout) {
  			clearTimeout(timeout);
  			this._timeouts.delete(timeout);
  		}

  		/**
  		 * Sets an interval that will be automatically cancelled if the client is destroyed.
  		 * @param {Function} fn Function to execute
  		 * @param {number} delay Time to wait between executions (in milliseconds)
  		 * @param {...*} args Arguments for the function
  		 * @returns {Timeout}
  		 */
  		setInterval(fn, delay, ...args) {
  			const interval = setInterval(fn, delay, ...args);
  			this._intervals.add(interval);
  			return interval;
  		}

  		/**
  		 * Clears an interval.
  		 * @param {Timeout} interval Interval to cancel
  		 */
  		clearInterval(interval) {
  			clearInterval(interval);
  			this._intervals.delete(interval);
  		}

  		toJSON(...props) {
  			return flatten(this, {
  				domain: false
  			}, ...props);
  		}
  	}

  	function createCache(create) {
  		return {
  			has: () => false,
  			delete: () => false,
  			get: () => undefined,
  			create,
  		};
  	}

  	function subKey(event, args) {
  		return `${event}${JSON.stringify(args)}`;
  	}

  	/**
  	 * @typedef {RPCClientOptions}
  	 * @extends {ClientOptions}
  	 * @prop {string} transport RPC transport. one of `ipc` or `websocket`
  	 */

  	/**
  	 * The main hub for interacting with Discord RPC
  	 * @extends {BaseClient}
  	 */
  	RPCClient = class extends BaseClient {
  		/**
  		 * @param {RPCClientOptions} [options] Options for the client
  		 * You must provide a transport
  		 */
  		constructor(options = {}) {
  			super(Object.assign({
  				_tokenType: 'Bearer'
  			}, options));
  			this.accessToken = null;
  			this.clientID = null;

  			/**
  			 * Application used in this client
  			 * @type {?ClientApplication}
  			 */
  			this.application = null;

  			const Transport = transports[options.transport];
  			if (!Transport) {
  				throw new TypeError('RPC_INVALID_TRANSPORT', options.transport);
  			}


  			/**
  			 * Raw transport userd
  			 * @type {RPCTransport}
  			 */
  			this.transport = new Transport(this);
  			this.transport.on('message', this._onRpcMessage.bind(this));

  			/**
  			 * Map of nonces being expected from the transport
  			 * @type {Map}
  			 * @private
  			 */
  			this._expecting = new Map();

  			/**
  			 * Map of current subscriptions
  			 * @type {Map}
  			 * @private
  			 */
  			this._subscriptions = new Map();
  		}

  		/**
  		 * @typedef {RPCLoginOptions}
  		 * @param {string} [clientSecret] Client secret
  		 * @param {string} [accessToken] Access token
  		 * @param {string} [rpcToken] RPC token
  		 * @param {string} [tokenEndpoint] Token endpoint
  		 * @param {string[]} [scopes] Scopes to authorize with
  		 */

  		/**
  		 * Log in
  		 * @param {string} clientID Client ID
  		 * @param {RPCLoginOptions} options Options for authentication.
  		 * At least one property must be provided to perform login.
  		 * @example client.login('1234567', { clientSecret: 'abcdef123' });
  		 * @returns {Promise<RPCClient>}
  		 */
  		login(clientID, options) {
  			return new Promise((resolve, reject) => {
  					this.clientID = clientID;
  					this.options._login = options || {};
  					const timeout = setTimeout(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 10e3);
  					timeout.unref();
  					this.once('connected', () => {
  						clearTimeout(timeout);
  						resolve(this);
  					});
  					this.transport.once('close', reject);
  					this.transport.connect({
  						client_id: this.clientID
  					});
  				})
  				.then(() => {
  					if (!options) {
  						this.emit('ready');
  						return this;
  					}
  					if (options.accessToken) {
  						return this.authenticate(options.accessToken);
  					}
  					return this.authorize(options);
  				});
  		}

  		/**
  		 * Request
  		 * @param {string} cmd Command
  		 * @param {Object} [args={}] Arguments
  		 * @param {string} [evt] Event
  		 * @returns {Promise}
  		 * @private
  		 */
  		request(cmd, args, evt) {
  			return new Promise((resolve, reject) => {
  				const nonce = Snowflake.generate();
  				this.transport.send({
  					cmd,
  					args,
  					evt,
  					nonce
  				});
  				this._expecting.set(nonce, {
  					resolve,
  					reject
  				});
  			});
  		}

  		/**
  		 * Message handler
  		 * @param {Object} message message
  		 * @private
  		 */
  		_onRpcMessage(message) {
  			if (message.cmd === "DISPATCH" && message.evt === "READY") {
  				this.emit('connected');
  			} else if (this._expecting.has(message.nonce)) {
  				const {
  					resolve,
  					reject
  				} = this._expecting.get(message.nonce);
  				if (message.evt === 'ERROR') {
  					reject(new Error('RPC_CLIENT_ERROR', `${message.data.code} ${message.data.message}`));
  				} else {
  					resolve(message.data);
  				}
  				this._expecting.delete(message.nonce);
  			} else {
  				const subid = subKey(message.evt, message.args);
  				if (!this._subscriptions.has(subid)) {
  					return;
  				}
  				this._subscriptions.get(subid)(message.data);
  			}
  		}

  		/**
  		 * Authorize
  		 * @param {Object} options options
  		 * @returns {Promise}
  		 * @private
  		 */
  		async authorize({
  			rpcToken,
  			scopes,
  			clientSecret,
  			tokenEndpoint
  		}) {
  			if (tokenEndpoint && !rpcToken) {
  				rpcToken = await request.get(tokenEndpoint)
  					.then((r) => r.body.rpc_token);
  			} else if (clientSecret && rpcToken === true) {
  				rpcToken = await this.api.oauth2.token.rpc.post({
  					headers: {
  						'Content-Type': 'application/x-www-form-urlencoded'
  					},
  					data: {
  						client_id: this.clientID,
  						client_secret: clientSecret,
  					},
  				});
  			}

  			const {
  				code
  			} = await this.request('AUTHORIZE', {
  				client_id: this.clientID,
  				scopes,
  				rpc_token: rpcToken,
  			});

  			if (tokenEndpoint) {
  				const r = await request.post(tokenEndpoint)
  					.send({
  						code
  					});
  				return this.authenticate(r.body.access_token);
  			} else if (clientSecret) {
  				const {
  					access_token: accessToken
  				} = await this.api.oauth2.token.post({
  					query: {
  						client_id: this.clientID,
  						client_secret: clientSecret,
  						code,
  						grant_type: 'authorization_code',
  					},
  					auth: false,
  				});
  				return this.authenticate(accessToken);
  			}

  			return {
  				code
  			};
  		}

  		/**
  		 * Authenticate
  		 * @param {string} accessToken access token
  		 * @returns {Promise}
  		 * @private
  		 */
  		authenticate(accessToken) {
  			this.accessToken = accessToken;
  			return this.request('AUTHENTICATE', {
  					access_token: accessToken
  				})
  				.then(({
  					application,
  					user
  				}) => {
  					this.application = new ClientApplication(this, application);
  					this.emit('ready');
  					return this;
  				});
  		}

  		setActivity(args = {}, pid = getPid()) {
  			let timestamps;
  			let assets;
  			let party;
  			let secrets;
  			if (args.startTimestamp || args.endTimestamp) {
  				timestamps = {
  					start: args.startTimestamp,
  					end: args.endTimestamp,
  				};
  				if (timestamps.start instanceof Date) {
  					timestamps.start = parseInt(timestamps.start.getTime());
  				} else if (typeof timestamps.start === 'number') {
            timestamps.start = parseInt(timestamps.start)
          }
  				if (timestamps.end instanceof Date) {
  					timestamps.end = parseInt(timestamps.end.getTime());
  				} else if (typeof timestamps.end === 'number') {
            timestamps.end = parseInt(timestamps.end.getTime());
          }
  			}
  			if (
  				args.largeImageKey || args.largeImageText ||
  				args.smallImageKey || args.smallImageText
  			) {
  				assets = {
  					large_image: args.largeImageKey,
  					large_text: args.largeImageText,
  					small_image: args.smallImageKey,
  					small_text: args.smallImageText,
  				};
  			}
  			if (args.partySize || args.partyId || args.partyMax) {
  				party = {
  					id: args.partyId
  				};
  				if (args.partySize || args.partyMax) {
  					party.size = [args.partySize, args.partyMax];
  				}
  			}
  			if (args.matchSecret || args.joinSecret || args.spectateSecret) {
  				secrets = {
  					match: args.matchSecret,
  					join: args.joinSecret,
  					spectate: args.spectateSecret,
  				};
  			}

  			const activity = {
  				state: args.state,
  				details: args.details,
  				timestamps,
  				assets,
  				party,
  				secrets,
  				instance: !!args.instance,
  			}
  			if (args.buttons?.length) {
  				activity.buttons = args.buttons;
  			}

  			return this.request("SET_ACTIVITY", {
  				pid,
  				activity
  			});
  		}

  		/**
  		 * Clears the currently set presence, if any. This will hide the "Playing X" message
  		 * displayed below the user's name.
  		 * @param {number} [pid] The application's process ID. Defaults to the executing process' PID.
  		 * @returns {Promise}
  		 */
  		clearActivity(pid = getPid()) {
  			return this.request("SET_ACTIVITY", {
  				pid,
  			});
  		}

  		/**
  		 * Subscribe to an event
  		 * @param {string} event Name of event e.g. `MESSAGE_CREATE`
  		 * @param {Object} [args] Args for event e.g. `{ channel_id: '1234' }`
  		 * @param {Function} callback Callback when an event for the subscription is triggered
  		 * @returns {Promise<Object>}
  		 */
  		subscribe(event, args, callback) {
  			if (!callback && typeof args === 'function') {
  				callback = args;
  				args = undefined;
  			}
  			return this.request("SUBSCRIBE", args, event)
  				.then(() => {
  					const subid = subKey(event, args);
  					this._subscriptions.set(subid, callback);
  					return {
  						unsubscribe: () => this.request("UNSUBSCRIBE", args, event)
  							.then(() => this._subscriptions.delete(subid)),
  					};
  				});
  		}

  		/**
  		 * Destroy the client
  		 */
  		async destroy() {
  			super.destroy();
  			this.transport.close();
  		}
  	}
  })();

  // https://github.com/devsnek/discord-rich-presence
  function makeClient(id) {
  	const rpc = new RPCClient({
  		transport: 'ipc'
  	});

  	let connected = false;
  	let activityCache = null;

  	const instance = new class RP extends EventEmitter {
  		updatePresence(d) {
  			if (connected)
  				rpc.setActivity(d)
  				.catch((e) => this.emit('error', e));
  			else
  				activityCache = d;
  		}

  		reply(user, response) {
  			const handle = (e) => this.emit('error', e);
  			switch (response) {
  				case 'YES':
  					rpc.sendJoinInvite(user)
  						.catch(handle);
  					break;
  				case 'NO':
  				case 'IGNORE':
  					rpc.closeJoinRequest(user)
  						.catch(handle);
  			}
  		}

  		disconnect() {
  			rpc.destroy()
  				.catch((e) => this.emit('error', e));
  		}
  	};

  	rpc.login(id)
  		.then(() => {
  			instance.emit('connected');
  			connected = true;
  			if (activityCache) {
  				rpc.setActivity(activityCache)
  					.catch((e) => instance.emit("setActivityFailed", e));
  				activityCache = null;
  			}
  		})
  		.catch((e) => instance.emit("loginFailed", e));

  	return instance;
  }

  RPClient = makeClient;
})();

function versionCompare(a, b) {
  a = a.toLowerCase().split(/[.-]/).map(x => /\d/.test(x[0]) ? x.padStart(10, "0") : x.padEnd(10, "0")).join("");
  b = b.toLowerCase().split(/[.-]/).map(x => /\d/.test(x[0]) ? x.padStart(10, "0") : x.padEnd(10, "0")).join("");
  if (a === b) return 0;
  return (a < b) ? -1 : 1;
}

class FunctionQueue {
  constructor() {
    this.queue = [];
  }
  push(func) {
    this.queue.push(func);
    if (this.queue.length === 1) {
      this.advanceQueue();
    }
  }
  async advanceQueue() {
    try {
      await this.queue[0]();
    } catch (e) {
      console.error("ASRP: ", e);
    }
    this.queue.shift();
    if (this.queue.length) {
      setTimeout(this.advanceQueue.bind(this), 0);
    }
  }
}

class AutoStartRichPresence {
  constructor() {
    this.initialized = false;
    this.client = null;
  }
  async start() {
    if (typeof window.ZeresPluginLibrary === "undefined") {
      try {
        await this.askToDownloadZeresPluginLibrary();
        // Wait for ZeresPluginLibrary to load if it didn't load yet
        while (typeof window.ZeresPluginLibrary === "undefined") {
          await this.delay(500);
        }
      } catch (e) {
        console.error(e);
        return BdApi.showToast('AutoStartRichPresence: "ZeresPluginLibrary" was not downloaded, or the download failed. This plugin cannot start.', {type: "error"});
      }
    }
    this.initialize();
  }
  initialize() {
    console.log("Starting AutoStartRichPresence");
    window.ZeresPluginLibrary?.PluginUpdater?.checkForUpdate?.("AutoStartRichPresence", changelog.version, "https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js");
    BdApi.showToast("AutoStartRichPresence has started!");
    this.startTime = Date.now();
    this.settings = BdApi.loadData("AutoStartRichPresence", "settings") || {};
    if (this.settings.clientID || this.settings.details || this.settings.state) {
      this.migrateData();
    }
    this.profiles = BdApi.loadData("AutoStartRichPresence", "profiles") || [];
    this.session = {
      editingProfile: this.settings.activeProfileID || 0,
      // When calling start/stop functions, this prevents crashes
      functionQueue: new FunctionQueue()
    };
    this.currentClientID = this.activeProfile?.clientID;
    this.rpcClientInfo = {};
    this.discordSetActivityHandler = null;
    if (this.currentClientID) {
      this.startRichPresence();
    }
    if (!this.settings.lastChangelogVersionSeen || versionCompare(changelog.version, this.settings.lastChangelogVersionSeen) === 1) {
      window.ZeresPluginLibrary.Modals.showChangelogModal(changelog.title, changelog.version, changelog.changelog);
      this.settings.lastChangelogVersionSeen = changelog.version;
      this.updateSettings();
    }
    this.initialized = true;
  }
  async stop() {
    if (this.settings.rpcEventInjection) this.stopRichPresenceInjection();
    this.stopRichPresence();
    this.initialized = false;
    BdApi.showToast("AutoStartRichPresence is stopping!");
  }
  get activeProfile() {
    return this.profiles[this.settings.activeProfileID];
  }
  getSettingsPanel() {
    if (!this.initialized) return;
    this.settings = BdApi.loadData("AutoStartRichPresence", "settings") || {};
    this.profiles = BdApi.loadData("AutoStartRichPresence", "profiles") || [];
    const panel = document.createElement("form");
    panel.classList.add("form");
    panel.style.setProperty("width", "100%");
    if (this.initialized) this.generateSettings(panel);
    return panel;
  }
  startRichPresence() {
    this.session.functionQueue.push(() => this._startRichPresence());
  }
  updateRichPresence() {
    this.session.functionQueue.push(() => this._updateRichPresence());
  }
  stopRichPresence() {
    this.session.functionQueue.push(() => this._stopRichPresence());
  }
  startRichPresenceInjection() {
    this.session.functionQueue.push(() => this._startRichPresenceInjection());
  }
  updateRichPresenceInjection() {
    this.session.functionQueue.push(() => this._updateRichPresenceInjection());
  }
  stopRichPresenceInjection() {
    this.session.functionQueue.push(() => this._stopRichPresenceInjection());
  }
  async _startRichPresence() {
    if (this.settings.rpcEventInjection) return await this._startRichPresenceInjection();
    this.client?.removeAllListeners?.();
    this.client?.disconnect?.();
    this.client = RPClient(this.currentClientID);
    this.client.on("setActivityFailed", e => {
      console.error(e);
      BdApi.showToast("Failed to set Rich Presence activity.", {type: "error"});
    });
    this.client.on("loginFailed", async e => {
      console.error(e);
      this.client?.removeAllListeners?.();
      this.client?.disconnect?.();
      BdApi.showToast("Rich Presence client ID authentication failed. Make sure your client ID is correct.", {type: "error"});
    });
    this._updateRichPresence();
  }
  _updateRichPresence() {
    if (this.settings.rpcEventInjection) return this._updateRichPresenceInjection();
    if (!this.client || this.currentClientID !== this.activeProfile.clientID) {
      this.currentClientID = this.activeProfile.clientID;
      return this._startRichPresence();
    }
    const buttons = [];
    if (this.activeProfile.button1Label && this.activeProfile.button1URL) {
      if (validButtonURLRegex.test(this.activeProfile.button1URL)) {
        buttons.push({
          label: this.activeProfile.button1Label,
          url: this.activeProfile.button1URL
        });
      } else {
        BdApi.showToast("Invalid button 1 URL.", {type: "error"});
      }
    }
    if (this.activeProfile.button2Label && this.activeProfile.button2URL) {
      if (validButtonURLRegex.test(this.activeProfile.button2URL)) {
        buttons.push({
          label: this.activeProfile.button2Label,
          url: this.activeProfile.button2URL
        });
      } else {
        BdApi.showToast("Invalid button 2 URL.", {type: "error"});
      }
    }
    this.client.updatePresence({
      details: this.activeProfile.details || undefined,
      state: this.activeProfile.state || undefined,
      startTimestamp: this.activeProfile.enableStartTime ? this.startTime / 1000 : undefined,
      largeImageKey: this.activeProfile.largeImageKey || undefined,
      smallImageKey: this.activeProfile.smallImageKey || undefined,
      largeImageText: this.activeProfile.largeImageText || undefined,
      smallImageText: this.activeProfile.smallImageText || undefined,
      buttons: buttons.length ? buttons : null
    });
  }
  async _stopRichPresence() {
    return this.client?.disconnect?.();
  }
  async _startRichPresenceInjection() {
    const RPCValidatorModule = BdApi.findModuleByProps("validateSocketClient");
    const validateRPC = RPCValidatorModule.validateSocketClient.bind(RPCValidatorModule);
    let validationObject = {
      application: {id: null, name: null, icon: null},
      authorization: {accessToken: null, authing: false, expires: new Date(0), scopes: []},
      encoding: "json",
      transport: "ipc",
      id: "1",
      version: 1
    };
    try {
      await validateRPC(validationObject, null, this.currentClientID);
    } catch (e) {
      console.error(e);
      if (e.message === "Invalid Client ID") {
        return BdApi.showToast("Rich Presence client ID authentication failed. Make sure your client ID is correct.", {type: "error"});
      } else {
        return BdApi.showToast("Failed to set Rich Presence activity.", {type: "error"});
      }
    }
    this.rpcClientInfo = validationObject.application;
    return await this._updateRichPresenceInjection();
  }
  async _updateRichPresenceInjection() {
    if (this.currentClientID !== this.activeProfile.clientID) {
      this.currentClientID = this.activeProfile.clientID;
      return await this._startRichPresenceInjection();
    }
    const SetActivityModule = BdApi.findModuleByProps("SET_ACTIVITY").SET_ACTIVITY;
    if (!this.discordSetActivityHandler) this.discordSetActivityHandler = SetActivityModule.handler;
    SetActivityModule.handler = function () {};
    const setActivity = this.discordSetActivityHandler.bind(SetActivityModule);
    try {
      await setActivity(this.buildActivityObject());
    } catch (e) {
      console.error(e);
      BdApi.showToast("Failed to set Rich Presence activity.", {type: "error"});
    }
  }
  async _stopRichPresenceInjection() {
    if (this.discordSetActivityHandler) {
      const SetActivityModule = BdApi.findModuleByProps("SET_ACTIVITY").SET_ACTIVITY;
      const setActivity = this.discordSetActivityHandler.bind(SetActivityModule);
      // Should unset Rich Presence?
      setActivity({
        socket: {
          transport: "ipc"
        },
        cmd: "SET_ACTIVITY",
        args: {
          pid: require("process").pid,
        }
      });
      SetActivityModule.handler = this.discordSetActivityHandler;
    }
  }
  buildActivityObject() {
    const activityObject = {
      socket: {
        transport: "ipc",
        id: "1",
        version: 1,
        encoding: "json",
        application: {
          id: this.currentClientID,
          name: this.rpcClientInfo.name,
          icon: null,
          coverImage: this.rpcClientInfo.coverImage,
          flags: this.rpcClientInfo.flags
        }
      },
      cmd: "SET_ACTIVITY",
      args: {
        pid: require("process").pid,
        activity: {
          timestamps: {},
          assets: {},
          buttons: [],
          name: this.rpcClientInfo.name,
          application_id: this.currentClientID
        }
      }
    };
    if (this.activeProfile.details) {
      activityObject.args.activity.details = this.activeProfile.details;
    }
    if (this.activeProfile.state) {
      activityObject.args.activity.state = this.activeProfile.state;
    }
    if (this.activeProfile.enableStartTime) {
      activityObject.args.activity.timestamps.start = Math.floor(this.startTime / 1000) * 1000;
    }
    if (this.activeProfile.largeImageKey) {
      activityObject.args.activity.assets.large_image = this.activeProfile.largeImageKey;
      if (this.activeProfile.largeImageText) {
        activityObject.args.activity.assets.large_text = this.activeProfile.largeImageText;
      }
    }
    if (this.activeProfile.smallImageKey) {
      activityObject.args.activity.assets.small_image = this.activeProfile.smallImageKey;
      if (this.activeProfile.smallImageText) {
        activityObject.args.activity.assets.small_text = this.activeProfile.smallImageText;
      }
    }
    if (this.activeProfile.button1Label && this.activeProfile.button1URL) {
      if (this.activeProfile.button1Label.length > 32) {
        BdApi.showToast("Button 1 label must not exceed 32 characters.", {type: "error"});
      } else if (validButtonURLRegex.test(this.activeProfile.button1URL)) {
        activityObject.args.activity.buttons.push({
          label: this.activeProfile.button1Label,
          url: this.activeProfile.button1URL
        });
      } else {
        BdApi.showToast("Invalid button 1 URL.", {type: "error"});
      }
    }
    if (this.activeProfile.button2Label && this.activeProfile.button2URL) {
      if (this.activeProfile.button2Label.length > 32) {
        BdApi.showToast("Button 2 label must not exceed 32 characters.", {type: "error"});
      } else if (validButtonURLRegex.test(this.activeProfile.button2URL)) {
        activityObject.args.activity.buttons.push({
          label: this.activeProfile.button2Label,
          url: this.activeProfile.button2URL
        });
      } else {
        BdApi.showToast("Invalid button 2 URL.", {type: "error"});
      }
    }
    if (!activityObject.args.activity.buttons.length) {
      delete activityObject.args.activity.buttons;
    }
    return activityObject;
  }
  updateSettings() {
    BdApi.saveData("AutoStartRichPresence", "settings", this.settings);
  }
  updateProfiles() {
    BdApi.saveData("AutoStartRichPresence", "profiles", this.profiles);
  }
  deleteProfile(id) {
    this.profiles.splice(id, 1);
    if (this.settings.activeProfileID === id) {
      this.settings.activeProfileID = 0;
      this.updateSettings();
      this.updateRichPresence();
    } else if (this.settings.activeProfileID > id) {
      this.settings.activeProfileID--;
      this.updateSettings();
    }
    if (this.session.editingProfile === id) {
      this.session.editingProfile = this.settings.activeProfileID;
    }
    this.updateProfiles();
  }
  generateSettings(panel) {
    let reloadRPCConfigGroup;
    let reloadEditProfileGroup;
    const profileInputs = new Map([
      ["name", new window.ZeresPluginLibrary.Settings.Textbox("Profile Name", "The name of this profile. Has no impact on the rich presence.", this.profiles[this.session.editingProfile]?.name || "", val => {this.profiles[this.session.editingProfile].name = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["clientID", new window.ZeresPluginLibrary.Settings.Textbox("Client ID", "The client ID of your Discord Rich Presence application.", this.profiles[this.session.editingProfile]?.clientID || "", val => {this.profiles[this.session.editingProfile].clientID = val?.trim?.();}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["details", new window.ZeresPluginLibrary.Settings.Textbox("Details", "The line that goes after your game's name.", this.profiles[this.session.editingProfile]?.details || "", val => {this.profiles[this.session.editingProfile].details = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["state", new window.ZeresPluginLibrary.Settings.Textbox("State", "The line that goes after the details.", this.profiles[this.session.editingProfile]?.state || "", val => {this.profiles[this.session.editingProfile].state = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["largeImageKey", new window.ZeresPluginLibrary.Settings.Textbox("Large Image Key", "The name of the asset for your large image.", this.profiles[this.session.editingProfile]?.largeImageKey || "", val => {this.profiles[this.session.editingProfile].largeImageKey = val?.trim?.();}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["largeImageText", new window.ZeresPluginLibrary.Settings.Textbox("Large Image Text", "The text that appears when your large image is hovered over.", this.profiles[this.session.editingProfile]?.largeImageText || "", val => {this.profiles[this.session.editingProfile].largeImageText = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["smallImageKey", new window.ZeresPluginLibrary.Settings.Textbox("Small Image Key", "The name of the asset for your small image.", this.profiles[this.session.editingProfile]?.smallImageKey || "", val => {this.profiles[this.session.editingProfile].smallImageKey = val?.trim?.();}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["smallImageText", new window.ZeresPluginLibrary.Settings.Textbox("Small Image Text", "The text that appears when your small image is hovered over.", this.profiles[this.session.editingProfile]?.smallImageText || "", val => {this.profiles[this.session.editingProfile].smallImageText = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["enableStartTime", new window.ZeresPluginLibrary.Settings.Switch("Enable Start Time", "Displays the amount of time your Rich Presence is enabled.", this.profiles[this.session.editingProfile]?.enableStartTime, val => {this.profiles[this.session.editingProfile].enableStartTime = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["button1Label", new window.ZeresPluginLibrary.Settings.Textbox("Button 1 Label", "Label for button.", this.profiles[this.session.editingProfile]?.button1Label || "", val => {this.profiles[this.session.editingProfile].button1Label = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["button1URL", new window.ZeresPluginLibrary.Settings.Textbox("Button 1 URL", "URL for button.", this.profiles[this.session.editingProfile]?.button1URL || "", val => {this.profiles[this.session.editingProfile].button1URL = val?.trim?.();}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["button2Label", new window.ZeresPluginLibrary.Settings.Textbox("Button 2 Label", "Label for button.", this.profiles[this.session.editingProfile]?.button2Label || "", val => {this.profiles[this.session.editingProfile].button2Label = val;}, {disabled: !this.profiles[this.session.editingProfile]})],
      ["button2URL", new window.ZeresPluginLibrary.Settings.Textbox("Button 2 URL", "URL for button.", this.profiles[this.session.editingProfile]?.button2URL || "", val => {this.profiles[this.session.editingProfile].button2URL = val?.trim?.();}, {disabled: !this.profiles[this.session.editingProfile]})]
    ]);
    const reloadEditProfileInputFields = () => {
      for (const [key, profileInput] of profileInputs.entries()) {
        const input = profileInput.getElement().querySelector("input");
        if (this.profiles[this.session.editingProfile]) {
          input.disabled = false;
          if (input.type === "checkbox") {
            if (input.checked !== !!this.profiles[this.session.editingProfile][key]) {
              // This is hacky but it works, and I don't feel like figuring out how to manipulate the React props
              input.click();
            }
          } else {
            input.value = this.profiles[this.session.editingProfile][key] || "";
          }
        } else {
          if (input.type === "checkbox") {
            if (input.checked) {
              input.click();
            }
          } else {
            input.value = "";
          }
          input.disabled = true;
        }
      }
    };
    const createActiveProfileDropdown = () => {
      return new window.ZeresPluginLibrary.Settings.Dropdown("Select Active Profile", "", this.settings.activeProfileID, this.profiles.map((p, id) => ({label: p.name, value: id})), val => {this.settings.activeProfileID = val;}, {disabled: !this.profiles.length});
    };
    const createRPCInjectionSwitch = () => {
      return new window.ZeresPluginLibrary.Settings.Switch("RPC Event Injection", "Bypasses the use of IPC and hopefully prevents other programs from using their own Rich Presences. Some errors may silently fail, so if something is not working, turn this switch off.", this.settings.rpcEventInjection, val => {
        this.settings.rpcEventInjection = val;
        if (val) {
          this.stopRichPresence();
        } else {
          this.stopRichPresenceInjection();
        }
        this.startRichPresence();
      });
    };
    const createEditProfileDropdown = () => {
      return new window.ZeresPluginLibrary.Settings.Dropdown("", "", this.session.editingProfile, this.profiles.map((p, id) => ({label: p.name, value: id})), val => {
        this.session.editingProfile = val;
        reloadEditProfileInputFields();
      }, {disabled: !this.profiles.length});
    };
    let activeProfileDropdown = createActiveProfileDropdown();
    let rpcInjectionSwitch = createRPCInjectionSwitch();
    let editProfileDropdown = createEditProfileDropdown();
    // Regular HTML elements don't need to be recreated when resetting setting groups
    const newProfileButton = document.createElement("button");
    newProfileButton.innerText = "Create New Profile";
    newProfileButton.classList.add(
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonColors.BRAND,
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonSizes.MEDIUM,
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonLooks.FILLED,
      ZeresPluginLibrary.WebpackModules.find(m => m.button && m.grow).button,
      ZeresPluginLibrary.WebpackModules.find(m => m.button && m.grow).grow
    );
    newProfileButton.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      this.profiles.push({
        name: "New Profile"
      });
      this.session.editingProfile = this.profiles.length - 1;
      this.updateProfiles();
      reloadRPCConfigGroup();
      reloadEditProfileGroup();
      reloadEditProfileInputFields();
    });
    const deleteProfileButton = document.createElement("button");
    deleteProfileButton.innerText = "Delete Profile";
    deleteProfileButton.classList.add(
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonColors.RED,
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonSizes.MEDIUM,
      ZeresPluginLibrary.DiscordModules.ButtonData.ButtonLooks.FILLED,
      ZeresPluginLibrary.WebpackModules.find(m => m.button && m.grow).button,
      ZeresPluginLibrary.WebpackModules.find(m => m.button && m.grow).grow
    );
    deleteProfileButton.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const profileIDToDelete = this.session.editingProfile;
      BdApi.showConfirmationModal("Delete Rich Presence Profile", `Are you sure you want to delete ${this.profiles[profileIDToDelete].name || "this profile"}? (This will not delete any Discord Developer Applications.)`, {
        danger: true,
        confirmText: "Delete",
        onConfirm: () => {
          this.deleteProfile(profileIDToDelete);
          this.updateProfiles();
          reloadRPCConfigGroup();
          reloadEditProfileGroup();
          reloadEditProfileInputFields();
        }
      });
    });
    const rpcConfigGroup = new window.ZeresPluginLibrary.Settings.SettingGroup("Rich Presence Configuration", {collapsible: false, shown: true, callback: () => {clearTimeout(this.currentTimeout); this.currentTimeout = setTimeout(() => {this.updateSettings(); this.updateProfiles(); this.updateRichPresence();}, 5000);}}).appendTo(panel).append(
      activeProfileDropdown,
      rpcInjectionSwitch,
      newProfileButton
    );
    reloadRPCConfigGroup = () => {
      rpcConfigGroup.group.children[1].textContent = "";
      activeProfileDropdown = createActiveProfileDropdown();
      rpcInjectionSwitch = createRPCInjectionSwitch();
      rpcConfigGroup.append(
        activeProfileDropdown,
        rpcInjectionSwitch,
        newProfileButton
      );
    };
    const editProfileGroup = new window.ZeresPluginLibrary.Settings.SettingGroup("Select Profile to Edit", {collapsible: false, shown: true}).appendTo(panel).append(editProfileDropdown, deleteProfileButton);
    reloadEditProfileGroup = () => {
      editProfileGroup.group.children[1].textContent = "";
      editProfileDropdown = createEditProfileDropdown();
      editProfileGroup.append(
        editProfileDropdown,
        deleteProfileButton
      );
    };
    new window.ZeresPluginLibrary.Settings.SettingGroup("Edit Selected Profile", {collapsible: false, shown: true, callback: () => {if (this.session.editingProfile === this.settings.activeProfileID) {clearTimeout(this.currentTimeout); this.currentTimeout = setTimeout(() => {this.updateSettings(); this.updateProfiles(); this.updateRichPresence();}, 5000);}}}).appendTo(panel).append(...profileInputs.values());
    let div = document.createElement("div");
    div.innerHTML = '<a href="https://discordapp.com/developers/applications/me" rel="noreferrer noopener" target="_blank">Create or edit your Discord Rich Presence application here!</a>';
    panel.appendChild(div);
    div = document.createElement("div");
    div.innerHTML = '<a href="https://www.youtube.com/watch?v=JIUOreTNj-o" rel="noreferrer noopener" target="_blank">Click here for a video tutorial of how to set up this plugin!</a>';
    panel.appendChild(div);
    div = document.createElement("div");
    div.innerHTML = '<a href="https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence#troubleshooting" rel="noreferrer noopener" target="_blank">Click here for troubleshooting.</a>';
    panel.appendChild(div);
    activeProfileDropdown.getElement().parentNode.style.overflow = "visible";
    editProfileDropdown.getElement().parentNode.style.overflow = "visible";
    profileInputs.get("name").addListener(() => {
      profileInputs.get("name").getElement().querySelector("input").addEventListener("blur", () => {
        reloadRPCConfigGroup();
        reloadEditProfileGroup();
      });
    });
  }
  migrateData() {
    let profilesData = BdApi.loadData("AutoStartRichPresence", "profiles");
    if (profilesData) return;
    this.settings = BdApi.loadData("AutoStartRichPresence", "settings");
    this.settings.activeProfileID = 0;
    profilesData = [{
      name: "My Profile"
    }];
    for (const key of ["clientID", "details", "state", "largeImageKey", "largeImageText", "smallImageKey", "smallImageText", "enableStartTime", "button1Label", "button1URL", "button2Label", "button2URL"]) {
      profilesData[0][key] = this.settings[key];
      delete this.settings[key];
    }
    this.settings.rpcEventInjection = this.settings.experimentalRPCEventInjection || false;
    delete this.settings.experimentalRPCEventInjection;
    this.profiles = profilesData;
    this.updateProfiles();
    this.updateSettings();
  }
  askToDownloadZeresPluginLibrary() {
    return new Promise((resolve, reject) => {
      BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.constructor.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
          require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
            if (error) {
              console.error(error);
              require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
              return reject();
            }
            try {
              await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
              resolve();
            } catch (e) {
              console.error(`${this.constructor.name}: `, e);
              reject();
            }
          });
        },
        onCancel: reject
      });
    });
  }
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = AutoStartRichPresence;
