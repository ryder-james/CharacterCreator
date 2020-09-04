const mongoose = require(`mongoose`);

const hash = require(`../modules/hash.js`);
const schema = require(`../modules/schema.js`);

const character = require(`../character`);

mongoose.Promise = global.Promise;

let pass = process.env.MONGO_PASS;
if (!pass) {
	let secret = require(`../secret`);
	pass = secret["mongo-pass"];
}

mongoose.connect(`mongodb+srv://rjames:${pass}@comcharacters.ep4vw.mongodb.net/CoMCharacters?retryWrites=true&w=majority`, {
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

exports.api = (req, res) => {
	res.render(`api`);
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

			res.redirect(`/addThemebook`);
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

			res.redirect(`/characters`);
		});
	});
};

exports.create = (req, res) => {
	res.render(`create`);
};

exports.createCharacter = (req, res) => {
	res.render(`createCharacter`);
};


exports.characters = (req, res) => {
	schema.User.findById(req.session.user.id, (err, user) => {
		if (err) {
			return console.error(err);
		}

		res.render(`characters`, {
			characterCount: user.characters.length,
			maxCharacters: 3,
			hasCharacters: user.characters.length > 0,
			characters: user.characters
		});
	});
};


exports.character = (req, res) => {
	schema.User.findById(req.session.user.id, (err, user) => {
		if (err) {
			return console.error(err);
		}

		if (user.characters.length > req.params.index) {
			res.render(`character`, {
				character: user.characters[req.params.index]
			});
		}
	});
};

exports.addThemebook = (req, res) => {
	res.render(`add-themebook`);
};

exports.addThemebookPost = (req, res) => {
	let newThemebook = new schema.Themebook({
		title: req.body.title,
		type: req.body.type,
		examples: [],
		concept: {
			question: req.body.conceptQuestion,
			answers: req.body.conceptExamples.split(";")
		},
		powerTagQuestions: [],
		weaknessTagsQuestions: [],
		mysteryIdentitySuggestions: req.body.mysterySuggestions.split(";"),
		crewRelationships: req.body.crewRelationships.split(";")
	});

	for (let i = 0; i < req.body.powerTagCount; i++) {
		let powerTag = {
			question: {
				index: req.body[`powerTagIndex${i}`],
				text: req.body[`powerTagQuestion${i}`]
			},
			exampleAnswers: req.body[`powerTagExamples${i}`].split(", ")
		};
		newThemebook.powerTagQuestions.push(powerTag);
	}

	for (let i = 0; i < req.body.weaknessTagCount; i++) {
		let weaknessTag = {
			question: {
				index: req.body[`weaknessTagIndex${i}`],
				text: req.body[`weaknessTagQuestion${i}`]
			},
			exampleAnswers: req.body[`weaknessTagExamples${i}`].split(", ")
		};
		newThemebook.weaknessTagQuestions.push(weaknessTag);
	}

	newThemebook.save(err => {
		if (err) {
			return console.error(err);
		}

		res.redirect(`/addThemebook`);
	});
};
