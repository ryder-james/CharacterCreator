const mongoose = require(`mongoose`);

const hash = require(`../modules/hash.js`);
const schema = require(`../modules/schema.js`);

const secret = require(`../secret`);
const character = require(`../character`);

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://rjames:${secret['mongo-pass']}@comcharacters.ep4vw.mongodb.net/CoMCharacters?retryWrites=true&w=majority`, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

let mdb = mongoose.connection;
mdb.on(`error`, console.error.bind(console, `connection error`));
mdb.once(`open`, callback => {
	
});

exports.index = (req, res) => {
	res.render(`index`, {
		title: "Home"
	});
};

exports.signin = (req, res) => {
	schema.User.find({ username: req.body.username.toLowerCase() }, (err, users) => {
		if (err) {
			return console.err(err);
		}

		if(users[0] && hash.compareToHash(req.body.password, users[0].password)) {
			req.session.user = {
				isAuthenticated: true,
				isAdmin: users[0].isAdmin,
				name: users[0].displayName,
				id: users[0].id
			}

			res.redirect(`/character`);
		} else {
			res.redirect(`/`);
		}
	});
};


exports.signup = (req, res) => {
	res.render(`signup`, {
		title: "Sign Up"
	});
};

exports.signupUser = (req, res) => {
	schema.User.find({ $or:[{email: req.body.email}, {username: req.body.username.toLowerCase()}] }, (err, users) => {
		if (err) {
			return console.error(err);
		}

		if (users[0]) {
			res.redirect(`signup`);
			return;
		}

		let newUser = new schema.User({
			email: req.body.email,
			username: req.body.username.toLowerCase(),
			displayName: req.body.displayName,
			password: hash.createHash(req.body.password),
			isAdmin: false,
			characters: []
		});

		newUser.save(err => {
			if (err) {
				return console.error(err);
			}

			req.session.user = {
				isAuthenticated: true,
				isAdmin: false,
				name: newUser.displayName,
				id: newUser.id
			}

			res.redirect(`/character`);
		});
	});
};

exports.character = (req, res) => {
	res.render(`character`, {
		character
	});
};

