var menu = require('../../lib/menu');
var menuBuilder = require('../../lib/menu/builder');
var appzone = require('../../lib/appzone');
var config = require('./config');

var sender = appzone.sender(config.appzone.url, config.appzone.appId, config.appzone.password);
var receiver = appzone.receiver(config.port);

console.log('started appzone menu receiver on: %s', config.port);

//build the menu

var subMenu = menu('sub').
	title('submenu').
	item('exit').on('you exited');

var mainMenu = menu('main').
	title('mainmenu').
	item('sub').on(subMenu);

menuBuilder(sender, receiver, mainMenu);
