const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');
const controllerCampeonato = require('./src/controller/gerenciadorCampeonatos');
const {ensureAuthenticated} = require('./config/auth')
const passport = require('passport');

app.get('/', function(req,res) {
	const isLogado = req.isAuthenticated();
	res.render("index", {logado: isLogado});
});

app.get('/login', function(req,res) {
	if(req.isAuthenticated()) {
		res.render("index", {});
	} else {
		res.render("login", {});
	}
});

app.post('/login',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect : '/',
		failureRedirect: '/login',
		failureFlash : true
	})(req,res,next)
})

app.get('/brasileirao-serie-a-2021', async function(req,res) {
	const campeonato = await controller.obterCampeonato("BRA2021A");
	const times = await controller.obterTimes("BRA2021A");
	const rodadas = await controller.obterRodadas("BRA2021A");
	
	res.render("simulador", 
	{
		campeonato: campeonato,
		times: times,
		rodadas: rodadas
	});
});

app.get('/brasileirao-serie-b-2021', async function(req,res) {
	const campeonato = await controller.obterCampeonato("BRA2021B");
	const times = await controller.obterTimes("BRA2021B");
	const rodadas = await controller.obterRodadas("BRA2021B");
	
	res.render("simulador", 
	{
		campeonato: campeonato,
		times: times,
		rodadas: rodadas
	});
});

app.get('/gerenciar',ensureAuthenticated, async (req,res)=>{
	const dadosCompletos = await controllerCampeonato.getDadosCampeonatoCompleto(req.query.campeonato);
	if(dadosCompletos != null) {
		res.render('gerenciador', dadosCompletos);
	} else {
		res.render("index", {logado: true, error_msg: "Campeonato inválido"});
	} 
});

app.post('/gerenciar/:campeonatoId',ensureAuthenticated, async (req,res)=>{
	const dataCampeonato = { nome: req.body.nome, ano: req.body.ano, rodada_atual: req.body.rodada_atual }
	await controllerCampeonato.atualizarCampeonato(req.params.campeonatoId, dataCampeonato);
	console.log(req.body)
	res.redirect("/");
});

app.get('/partidas/:rodadaId', async (req,res)=>{
	const partidas = await controller.obterPartidas(req.params.rodadaId);
	res.status(200).json(partidas);
});

app.listen(8080 , () => {
	console.log("SIMULADOR RODANDO NA PORTA 8080")
})