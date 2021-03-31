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

// app.use(function(req, res, next){

//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader("Access-Control-Allow-Credentials", true);

//     next();

// });

app.use(express.static('./public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Extraindo variaveis de ambiente. */
env.config({ path: './env/simulador.env' });

/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error',err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign().include('src/models').into(app);
	
/* exportar o objeto app */
module.exports = app;