const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');
const controllerCampeonato = require('./src/controller/gerenciadorCampeonatos');
const {ensureAuthenticated} = require('./config/auth')
const passport = require('passport');

app.get('/', async function(req,res) {
	const isLogado = req.isAuthenticated();
	const campeonatos = await controller.obterCampeonatos({ativo: true});
	res.render("index", {campeonatos, logado: isLogado, req, situacao: 1});
});

app.post('/', async function(req,res) {
	const isLogado = req.isAuthenticated();

	let filtro = {};
	const ativo = req.body.situacao;

	if (ativo == "1" ) {
		filtro['ativo'] = true;
	} else if (ativo == "2") {
		filtro['ativo'] = false;
	}

	const campeonatos = await controller.obterCampeonatos(filtro);
	res.render("index", {campeonatos, logado: isLogado, situacao: ativo});
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
	const isLogado = req.isAuthenticated();

	res.render("simulador", 
	{
		campeonato: campeonato,
		times: times,
		rodadas: rodadas,
		logado: isLogado
	});
});

app.get('/gerenciar',ensureAuthenticated, async (req,res)=>{
	if(!'campeonatoId' in req.query) {
		res.redirect("/")
	}
	const dadosCompletos = await controllerCampeonato.getDadosCampeonatoCompleto(req.query.campeonatoId);
	const isLogado = req.isAuthenticated();

	if(dadosCompletos != null) {
		dadosCompletos['logado'] = isLogado;
		res.render('gerenciador', dadosCompletos);
	} else {
		res.render("index", {logado: true, error_msg: "Campeonato inválido"});
	} 
});

app.post('/gerenciar/:campeonatoId',ensureAuthenticated, async (req,res)=>{
	
	var objetoFormatado = {}
	Object.keys(req.body).forEach((key, index) => {
		newKey = key.trim()
		objetoFormatado[newKey] = req.body[key]
	});

	const dataCampeonato = { nome: objetoFormatado.nome, ano: objetoFormatado.ano, rodada_atual: objetoFormatado.rodada_atual, 
		campeonato_de_selecoes: objetoFormatado.campeonato_de_selecoes, ativo: objetoFormatado.situacao }

	await controllerCampeonato.atualizarCampeonato(req.params.campeonatoId, dataCampeonato);
	const msgErro = await controllerCampeonato.atualizarPartidas(req.params.campeonatoId, objetoFormatado)

	if(msgErro == null) {
		const isLogado = req.isAuthenticated();
		const campeonatos = await controller.obterCampeonatos({ativo: true});
		res.render("index", {campeonatos, logado: isLogado, situacao: 1});
	}
	let dadosCompletos = await controllerCampeonato.getDadosCampeonatoCompleto(req.params.campeonatoId);
	if(dadosCompletos && msgErro) {
		const isLogado = req.isAuthenticated();
		dadosCompletos['logado'] = isLogado;
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