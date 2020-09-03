const express = require(`express`);
const path = require(`path`);
const bodyParser = require(`body-parser`)
const expressSession = require(`express-session`);
const routes = require(`./routes/routes`);
const secret = require(`./secret`);

const app = express();

app.use((req, res, next) => {
	res.header(`Access-Control-Allow-Origin`, `*`);
	res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
	next();
});

let urlencodedParser = bodyParser.urlencoded({
	extended: true
});

const checkAuth = (req, res, next) => {
	if (req.session.user && req.session.user.isAuthenticated) {
		next();
	} else {
		res.redirect(`/`);
	}
}

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `/views`));
app.use(express.static(path.join(__dirname, `/public`)));

app.use(expressSession({
	secret: secret["session-pass"],
	saveUninitialized: true,
	resave: true
}));

app.get(`/`, routes.index);
app.get(`/create`, routes.create);
app.get(`/signup`, routes.signup);
app.get(`/characters`, checkAuth, routes.characters)
app.get(`/character/:index`, checkAuth, routes.character);

app.post(`/signin`, urlencodedParser, routes.signin);
app.post(`/signup`, urlencodedParser, routes.signupUser);

app.listen(3000);