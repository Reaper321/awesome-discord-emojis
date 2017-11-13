const WebSocket = require('ws');
const fs = require('fs');

// Read token
let token;
if (process.argv[0].match(/.*node.*/) !== null) {
	token = process.argv[2];
} else {
	token = process.argv[1];
}

// Connect to discord
const ws = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=6');

// When the socket opens, pretend to be the discord client
ws.on('open', () => {
	// Send the login packet
	ws.send(JSON.stringify({
		op: 2,
		d: {
			token,
			properties: {
				os: "Mac OS X",
				browser: "Chrome",
				device: "",
				referrer: "",
				referring_domain: ""
			},
			large_threshold: 100,
			synced_guilds: [],
			presence: {
				status: "online",
				since: 0,
				afk: false,
				game: null
			},
			compress: false
		}
	}));

	// Send the state packet
	ws.send(JSON.stringify({
		op: 4,
		d: {
			guild_id: null,
			channel_id: null,
			self_mute: true,
			self_deaf: true,
			self_video: false
		}
	}));
});

// Process the initial state packet
ws.on('message', data => {
	// Parse answer
	data = JSON.parse(data);

	// Log event
	console.log('[W] ' + data['op'] + " / " + data['t']);

	// Drop event if not READY
	if (data.op !== 0 || data.t !== "READY") {
		return;
	}

	// We've got what we wanted.
	ws.close();

	// Aggregate emojis
	let emojis = {};

	for(let guild of data.d.guilds) {
		console.log();
		console.log('[G] ' + guild.id + ' / ' + guild.name);

		for(let emoji of guild.emojis) {
			console.log('[E] ' + emoji.name + ' -> ' + emoji.id);
			emojis[emoji.name] = emoji.id;
		}
	}

	// Save emojis as json
	fs.writeFileSync('./emojis.json', JSON.stringify(emojis));

	// Exit
	process.exit(0);
});