const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');
const controllerCampeonato = require('./src/controller/gerenciadorCampeonatos');
const {ensureAuthenticated} = require('./config/auth')
const passport = require('passport');

app.get('/', async function(req,res) {
	const isLogado = req.isAuthenticated();
	const campeonatos = await controller.obterCampeonatos();
	res.render("index", {campeonatos, logado: isLogado});
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

app.get('/simular', async function(req,res) {
	if(!req.query.campeonatoId) {
		res.redirect("/")
	}
	const campeonato = await controller.obterCampeonato(req.query.campeonatoId);
	const times = await controller.obterTimes(req.query.campeonatoId);
	const rodadas = await controller.obterRodadas(req.query.campeonatoId);
	
	res.render("simulador", 
	{
		campeonato: campeonato,
		times: times,
		rodadas: rodadas
	});
});

app.get('/gerenciar',ensureAuthenticated, async (req,res)=>{
	if(!'campeonatoId' in req.query) {
		res.redirect("/")
	}
	const dadosCompletos = await controllerCampeonato.getDadosCampeonatoCompleto(req.query.campeonatoId);
	if(dadosCompletos != null) {
		res.render('gerenciador', dadosCompletos);
	} else {
		res.render("index", {logado: true, error_msg: "Campeonato inválido"});
	} 
});

app.post('/gerenciar/:campeonatoId',ensureAuthenticated, async (req,res)=>{
	const dataCampeonato = { nome: req.body.nome, ano: req.body.ano, rodada_atual: req.body.rodada_atual }
	await controllerCampeonato.atualizarCampeonato(req.params.campeonatoId, dataCampeonato);
	const msgErro = await controllerCampeonato.atualizarPartidas(req.params.campeonatoId, req.body)
	if(msgErro == null) {
		res.redirect("/");
	}
	let dadosCompletos = await controllerCampeonato.getDadosCampeonatoCompleto(req.params.campeonatoId);
	if(dadosCompletos && msgErro) {
		dadosCompletos.error_msg = msgErro;
	}
	
	res.render('gerenciador', dadosCompletos);
});

app.get('/partidas/:rodadaId', async (req,res)=>{
	const partidas = await controller.obterPartidas(req.params.rodadaId);
	res.status(200).json(partidas);
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.listen(8080 , () => {
	console.log("SIMULADOR RODANDO NA PORTA 8080")
})