const { json } = require('body-parser');
const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');

app.get('/', async function(req,res) {
	res.render("index", {});
});

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

app.listen(8080 , () => {
	console.log("SIMULADOR RODANDO NA PORTA 8080")
})