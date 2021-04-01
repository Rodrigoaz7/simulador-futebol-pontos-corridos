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

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: false });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
    console.log(`🙅 🚫 → ${err.message}`);
});
	
/* exportar o objeto app */
module.exports = app;