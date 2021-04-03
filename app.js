const { json } = require('body-parser');
const app = require('./config/app');
const controller = require('./src/controller/buscarDadosSimulacao');

app.get('/', async function(req,res) {
	const times = await controller.obterTimes();
	const rodadas = await controller.obterRodadas();
	const campeonato = await controller.obterCampeonato("BRA2021A");

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