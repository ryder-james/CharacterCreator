const mongoose = require(`mongoose`);

let conceptSchema = new mongoose.Schema({
	question: String,
	answers: [String]
});

let questionSchema = new mongoose.Schema({
	index: String,
	text: String
})

let tagSchema = new mongoose.Schema({
	question: questionSchema,
	answer: String,
	exampleAnswers: [String],
	burned: Boolean
});

let themebookSchema = new mongoose.Schema({
	title: String,
	type: String,
	examples: [String],
	concept: conceptSchema,
	powerTagQuestions: [tagSchema],
	weaknessTagQuestions: [tagSchema],
	mysteryIdentitySuggestions: [String],
	crewRelationships: [String]
});

let crewSchema = new mongoose.Schema({
	name: String,
	help: Number,
	hurt: Number
});

let themeSchema = new mongoose.Schema({
	title: String,
	type: String,
	subtype: String,
	attention: Number,
	fadeCrack: Number,
	identityMythos: String,
	powerTags: [tagSchema],
	weaknessTags: [tagSchema],
	improvements: [String]
});

let characterSchema = new mongoose.Schema({
	name: String,
	player: String,
	mythos: String,
	logos: String,
	crew: [crewSchema],
	storyTags: [String],
	buildUp: Number,
	moments: [String],
	nemeses: [String],
	crewTheme: themeSchema,
	themes: [themeSchema]
});

let userSchema = new mongoose.Schema({
	email: String,
	username: String,
	displayName: String,
	password: String,
	isAdmin: Boolean,
	characters: [characterSchema]
});

exports.User = mongoose.model(`User_Collection`, userSchema);
exports.Themebook = mongoose.model(`Themebook_Collection`, themebookSchema);