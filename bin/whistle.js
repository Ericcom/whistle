#! /usr/bin/env node

var program = require('starting');
var path = require('path');
var config = require('../package.json');

program.setConfig({
	main: path.join(__dirname, '../index.js'),
	running: path.join(require('../util').LOCAL_DATA_PATH, '.running'),
	name: config.name,
	version: config.version,
	runCallback: function() {
		console.log('[i] Press [Ctrl+C] to stop %s...', config.name);
	},
	startCallback: function(alreadyInRunning) {
		console.log('[!] ' + config.name + ( alreadyInRunning ? ' is running.' : ' started.'));
	},
	restartCallback: function() {
		console.log('[!] %s started.', config.name);
	},
	stopCallback: function(err) {
		if (err === true) {
			console.log('[i] %s killed.', config.name);
		} else if (err) {
				err.code === 'EPERM' ? console.log('[!] Cannot kill %s owned by root.\n' +
					'    Try to run command with `sudo`.', config.name)
				: console.log('[!] %s', err.message);
		} else {
			console.log('[!] No running %s.', config.name);
		}
	}
});

program
	.option('-r, --rules [rule file path]', 'rules file', String, undefined)
	.option('-n, --username [username]', 'login username', String, undefined)
	.option('-w, --password [password]', 'login password', String, undefined)
	.option('-p, --port [port]', config.name + ' port(' + config.port + ' by default)', parseInt, undefined)
	.option('-m, --middlewares [script path or module name]', 'express middlewares path (as: xx,yy/zz.js)', String, undefined)
	.option('-u, --uipath [script path]', 'web ui plugin path', String, undefined)
	.option('-t, --timneout [ms]', 'request timeout(' + config.timeout + ' ms by default)', parseInt, undefined)
	.option('-s, --sockets [number]', 'max sockets', parseInt, undefined)
	.option('-d, --days [number]', 'the maximum days of cache', parseInt, undefined)
	.parse(process.argv);