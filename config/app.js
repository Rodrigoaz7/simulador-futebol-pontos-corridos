/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/* iniciar o objeto do express */
const app = express();

/* Variaveis de ambiente. */
const env = require('dotenv');

/* Importando o módulo do mongoose. */
const mongoose = require('mongoose');

const path = require('path');

const flash = require('connect-flash');

const session = require('express-session');

const passport = require("passport");

/* configurar o middleware body-parser */
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

const viewsDirPath = path.join(__dirname, "../src", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", viewsDirPath);
app.use(express.static(path.join(__dirname, "../public")));

/* Extraindo variaveis de ambiente. */
env.config({ path: './env/simulador.env' });

require('./passport')(passport)

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: false });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});

app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
});
	
/* exportar o objeto app */
module.exports = app;