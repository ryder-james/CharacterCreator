let questionSchema = mongoose.SchemaType({
	index: String,
	text: String
})

let tagSchema = mongoose.SchemaType({
	question: questionSchema,
	answer: String,
	burned: Boolean
});

let crewSchema = mongoose.SchemaType({
	name: String,
	help: Number,
	hurt: Number
});

let themeSchema = mongoose.SchemaType({
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

let characterSchema = mongoose.SchemaType({
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

let userSchema = mongoose.SchemaType({
	email: String,
	username: String,
	password: String,
	characters: [characterSchema]
});