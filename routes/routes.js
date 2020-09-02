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

exports.signup = (req, res) => {
	res.render(`signup`, {
		title: "Sign Up"
	});
};

exports.signupUser = (req, res) => {
	schema.User.find({ $or:[{email: req.body.email}, {username: req.body.username}] }, (err, users) => {
		if (err) {
			return console.error(err);
		}

		if (users[0]) {
			res.redirect(`signup`);
			return;
		}

		let newUser = new schema.User({
			email: req.body.email,
			username: req.body.username,
			password: hash.createHash(req.body.password),
			characters: []
		});

		newUser.save(err => {
			if (err) {
				return console.error(err);
			}

			req.sesion.user = {
				isAuthenticated: true,
				username: newUser.username,
				id: newUser.id
			}

			res.redirect(`/`);
		});
	});
};

exports.character = (req, res) => {
	res.render(`character`, {
		character
	});
};

