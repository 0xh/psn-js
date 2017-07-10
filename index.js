const Auth = require("/class/Auth"),
	  AuthException = require("/class/AuthException"),
	  Communities = require("/class/Communities"),
	  Friends = require("/class/Friends"),
	  Messaging = require("/class/Messaging"),
	  Trophies = require("/class/Trophies"),
	  User = require("/class/User"),
	  Utils = require("/class/Utils");

const Auth = new Auth(),
	  AuthException = new AuthException(),
	  Communities = new Communities(),
	  Friends = new Friends(),
	  Messaging = new Messaging(),
	  Trophies = new Trophies(),
	  User = new User(),
	  Utils = new Utils();

try {
	const account = new Auth('email@psn.com', 'password');
}
catch (AuthException(err)) {
	header('Content-Type: application/json');
	return console.log(err.getError());
}

let tokens = account.getTokens();
let user = new User(tokens);
console.log(`Hi ${user.me().profile.onlineId}`);